package com.agh.shoppingListBackend.app.integration;

import com.agh.shoppingListBackend.app.enums.RoleEnum;
import com.agh.shoppingListBackend.app.enums.Units;
import com.agh.shoppingListBackend.app.models.Item;
import com.agh.shoppingListBackend.app.models.Role;
import com.agh.shoppingListBackend.app.models.ShoppingList;
import com.agh.shoppingListBackend.app.models.User;
import com.agh.shoppingListBackend.app.payload.request.ItemDTO;
import com.agh.shoppingListBackend.app.payload.request.ListDTO;
import com.agh.shoppingListBackend.app.payload.request.LoginDTO;
import com.agh.shoppingListBackend.app.payload.response.SimpleListResponse;
import com.agh.shoppingListBackend.app.payload.response.SingleItemResponse;
import com.agh.shoppingListBackend.app.repository.ItemRepository;
import com.agh.shoppingListBackend.app.repository.ListRepository;
import com.agh.shoppingListBackend.app.repository.RoleRepository;
import com.agh.shoppingListBackend.app.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.assertj.core.internal.ByteArrays;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.http.Cookie;
import java.sql.Date;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.MethodName.class)
class ItemIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    private ObjectMapper objectMapper;

    @Autowired
    ListRepository listRepository;

    @Autowired
    ItemRepository itemRepository;

    @Autowired
    UserRepository testUserRepository;

    @Autowired
    RoleRepository testRoleRepository;

    @Autowired
    PasswordEncoder encoder;

    User loggedUser;
    ShoppingList loggedUserList;
    ShoppingList otherUserList;
    Item otherUserItem;
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
            this.loggedUserList = new ShoppingList("logged user test list", Date.valueOf("2022-11-17"), loggedUser);
            listRepository.save(this.loggedUserList);
        }

        User otherUser = new User("otherUser" , encoder.encode("pass"));
        if(!testUserRepository.findByUsername(otherUser.getUsername()).isPresent()) {
            otherUser.setRoles(Set.of(role));
            testUserRepository.save(otherUser);
            this.otherUserList = new ShoppingList("otherUser test list", Date.valueOf("2022-11-17"), otherUser);
            listRepository.save(this.otherUserList);
            this.otherUserItem = new Item();
            this.otherUserItem.setText("otherUser test item");
            this.otherUserItem.setQuantity(2.0f);
            this.otherUserItem.setUnit(Units.COUNT);
            this.otherUserItem.setList(this.otherUserList);
            this.otherUserItem.setUser(otherUser);
            itemRepository.save(this.otherUserItem);
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
        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setText("test text");
        itemDTO.setQuantity(1.0f);
        itemDTO.setListId(this.loggedUserList.getId());

        MockMultipartFile itemInfo = new MockMultipartFile("itemInfo", "",
                "application/json", objectMapper.writeValueAsBytes(itemDTO));
        MockMultipartFile image = new MockMultipartFile("image", new byte[1]);

        MvcResult result = mockMvc.perform(multipart("/api/item/add")
                .file(itemInfo)
                .file(image)
                .cookie(cookie)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.text").value(itemDTO.getText()))
                .andExpect(jsonPath("$.quantity").value(itemDTO.getQuantity()))
                .andExpect(jsonPath("$.unit").value(itemDTO.getUnit()))
                .andExpect(jsonPath("$.image").isNotEmpty())
                .andExpect(jsonPath("$.done").value(false))
                .andReturn();

        String json = result.getResponse().getContentAsString();
        SingleItemResponse response = objectMapper.readValue(json, SingleItemResponse.class);
        assertTrue(itemRepository.existsById(response.getId()));
    }



}
