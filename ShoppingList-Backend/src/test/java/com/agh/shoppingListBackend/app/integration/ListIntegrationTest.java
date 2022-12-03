package com.agh.shoppingListBackend.app.integration;


import com.agh.shoppingListBackend.app.enums.RoleEnum;
import com.agh.shoppingListBackend.app.models.Role;
import com.agh.shoppingListBackend.app.models.ShoppingList;
import com.agh.shoppingListBackend.app.models.User;
import com.agh.shoppingListBackend.app.payload.request.ListDTO;
import com.agh.shoppingListBackend.app.payload.request.LoginDTO;
import com.agh.shoppingListBackend.app.payload.response.ListsResponse;
import com.agh.shoppingListBackend.app.payload.response.SimpleListResponse;
import com.agh.shoppingListBackend.app.repository.ListRepository;
import com.agh.shoppingListBackend.app.repository.RoleRepository;
import com.agh.shoppingListBackend.app.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.http.Cookie;
import java.sql.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.MethodName.class)
class ListIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    private ObjectMapper objectMapper;

    @Autowired
    ListRepository listRepository;

    @Autowired
    UserRepository testUserRepository;

    @Autowired
    RoleRepository testRoleRepository;

    @Autowired
    PasswordEncoder encoder;

    User loggedUser;
    ShoppingList otherUserList;
    Cookie cookie;

    @BeforeAll
    void setUp() throws Exception {
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(this.context)
                .apply(springSecurity())
                .build();
        objectMapper =  new ObjectMapper();

        Role role = new Role(RoleEnum.ROLE_USER);
        if(!testRoleRepository.findByName(RoleEnum.ROLE_USER).isPresent()){
            testRoleRepository.save(role);
        }

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setUsername("testuser");
        loginDTO.setPassword("pass");

        User user = new User(loginDTO.getUsername(), encoder.encode(loginDTO.getPassword()));
        if(!testUserRepository.findByUsername(user.getUsername()).isPresent()) {
            user.setRoles(Set.of(role));
            testUserRepository.save(user);
            loggedUser = user;
        }

        User otherUser = new User("otherUser" , encoder.encode("pass"));
        if(!testUserRepository.findByUsername(otherUser.getUsername()).isPresent()) {
            otherUser.setRoles(Set.of(role));
            testUserRepository.save(otherUser);
            this.otherUserList = new ShoppingList("otherUser test list", Date.valueOf("2022-11-17"), otherUser);
            listRepository.save(this.otherUserList);
        }


        MvcResult result = mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDTO))
                .with(csrf()))
                .andExpect(status().isOk())
                .andReturn();

        cookie = result.getResponse().getCookie("shoppingList");
    }

    @Test
    @Order(1)
    void testIntegrationAddList() throws Exception {
        ListDTO listDTO = new ListDTO();
        listDTO.setName("test list");
        listDTO.setDate("2022-12-03");

        MvcResult result = mockMvc.perform(post("/api/list/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(listDTO))
                .cookie(this.cookie)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(listDTO.getName()))
                .andExpect(jsonPath("$.date").value(listDTO.getDate()))
                .andExpect(jsonPath("$.id").isNumber()).andReturn();

        String json = result.getResponse().getContentAsString();
        SimpleListResponse  response = objectMapper.readValue(json, SimpleListResponse.class);
        assertTrue(listRepository.existsById(response.getId()));
    }

    @Test
    @Order(2)
    @Transactional
    void testIntegrationUpdate() throws Exception {
        Optional<List<ShoppingList>> userLists = listRepository.findListsByUser(loggedUser);
        assertTrue(userLists.isPresent());
        assertTrue(userLists.get().size() > 0);
        ShoppingList listToUpdate = userLists.get().get(0);

        ListDTO listDTO = new ListDTO();
        listDTO.setName("test list updated");
        listDTO.setDate("2022-12-03");

        MvcResult result = mockMvc.perform(post("/api/list/update/" + listToUpdate.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(listDTO))
                .cookie(this.cookie)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(listDTO.getName()))
                .andExpect(jsonPath("$.date").value(listDTO.getDate()))
                .andExpect(jsonPath("$.id").value(listToUpdate.getId()))
                .andReturn();

        String json = result.getResponse().getContentAsString();
        SimpleListResponse  response = objectMapper.readValue(json, SimpleListResponse.class);
        ShoppingList updatedList = listRepository.getReferenceById(response.getId());
        assertEquals(listDTO.getName(), updatedList.getName());
        assertEquals(listDTO.getDate(), updatedList.getDate().toString());
    }

    @Test
    @Order(3)
    @Transactional
    void testIntegrationGetUserLists() throws Exception {
        Optional<List<ShoppingList>> userLists = listRepository.findListsByUser(loggedUser);
        assertTrue(userLists.isPresent());
        assertTrue(userLists.get().size() > 0);

        MvcResult result = mockMvc.perform(get("/api/list/all")
                .cookie(this.cookie)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shoppingLists").isArray())
                .andReturn();

        String json = result.getResponse().getContentAsString();
        ListsResponse response = objectMapper.readValue(json, ListsResponse.class);

        assertTrue(response.getShoppingLists().size() > 0);
        assertEquals(userLists.get().get(0).getId(), response.getShoppingLists().get(0).getId());
        assertEquals(userLists.get().get(0).getName(), response.getShoppingLists().get(0).getName());
        assertEquals(userLists.get().get(0).getDate().toString(), response.getShoppingLists().get(0).getDate());
    }

    @Test
    @Order(3)
    @Transactional
    void testIntegrationDelete() throws Exception {
        Optional<List<ShoppingList>> userLists = listRepository.findListsByUser(loggedUser);
        assertTrue(userLists.isPresent());
        assertTrue(userLists.get().size() > 0);
        ShoppingList listToDelete = userLists.get().get(0);

        mockMvc.perform(delete("/api/list/delete/" + listToDelete.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .cookie(this.cookie)
                .with(csrf()))
                .andExpect(status().isOk());

        assertFalse(listRepository.existsById(listToDelete.getId()));
    }

    @Test
    @Order(4)
    @Transactional
    void testIntegrationDeleteListWhichNotBelongToLoggedUser() throws Exception {
        mockMvc.perform(delete("/api/list/delete/" + otherUserList.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .cookie(this.cookie)
                .with(csrf()))
                .andExpect(status().isBadRequest());

        assertTrue(listRepository.existsById(otherUserList.getId()));
    }

    @Test
    @Order(4)
    @Transactional
    void testIntegrationUpdateListWhichNotBelongToLoggedUser() throws Exception {
        ListDTO listDTO = new ListDTO();
        listDTO.setName("test list updated");
        listDTO.setDate("2022-12-03");

        mockMvc.perform(post("/api/list/update/" + otherUserList.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(listDTO))
                .cookie(this.cookie)
                .with(csrf()))
                .andExpect(status().is4xxClientError());

        assertTrue(listRepository.existsById(otherUserList.getId()));
    }

    @Test
    @Order(5)
    @Transactional
    void testIntegrationUpdateListThatNotExists() throws Exception {
        Long id = 999999L;
        assertFalse(listRepository.existsById(id));

        ListDTO listDTO = new ListDTO();
        listDTO.setName("test list updated");
        listDTO.setDate("2022-12-03");

        mockMvc.perform(post("/api/list/update/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(listDTO))
                .cookie(this.cookie)
                .with(csrf()))
                .andExpect(status().is4xxClientError());

        assertFalse(listRepository.existsById(id));
    }
}
