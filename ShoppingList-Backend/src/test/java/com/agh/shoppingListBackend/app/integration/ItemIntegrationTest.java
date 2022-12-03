package com.agh.shoppingListBackend.app.integration;

import com.agh.shoppingListBackend.app.enums.RoleEnum;
import com.agh.shoppingListBackend.app.enums.Units;
import com.agh.shoppingListBackend.app.models.Item;
import com.agh.shoppingListBackend.app.models.Role;
import com.agh.shoppingListBackend.app.models.ShoppingList;
import com.agh.shoppingListBackend.app.models.User;
import com.agh.shoppingListBackend.app.payload.request.ItemDTO;
import com.agh.shoppingListBackend.app.payload.request.LoginDTO;
import com.agh.shoppingListBackend.app.payload.response.ItemsResponse;
import com.agh.shoppingListBackend.app.payload.response.SingleItemResponse;
import com.agh.shoppingListBackend.app.repository.ItemRepository;
import com.agh.shoppingListBackend.app.repository.ListRepository;
import com.agh.shoppingListBackend.app.repository.RoleRepository;
import com.agh.shoppingListBackend.app.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
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
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

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
        objectMapper = new ObjectMapper();

        Role role = roleRepository.findByName(RoleEnum.ROLE_USER)
                .orElseGet(() -> {
                    Role roleToAdd = new Role(RoleEnum.ROLE_USER);
                    roleRepository.save(roleToAdd);
                    return roleToAdd;
                });

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setUsername("testuser");
        loginDTO.setPassword("pass");
        loggedUser = userRepository.findByUsername(loginDTO.getUsername()).orElseGet(() -> {
            User userToAdd = new User(loginDTO.getUsername(), encoder.encode(loginDTO.getPassword()));
            userToAdd.setRoles(Set.of(role));
            userRepository.save(userToAdd);
            return userToAdd;
        });
        loggedUserList = new ShoppingList("logged user test list", Date.valueOf("2022-11-17"), loggedUser);
        listRepository.save(this.loggedUserList);

        String otherUserName = "otherUser";
        User otherUser = userRepository.findByUsername(otherUserName).orElseGet(() -> {
            User userToAdd = new User(otherUserName, encoder.encode("pass"));
            userToAdd.setRoles(Set.of(role));
            userRepository.save(userToAdd);
            return userToAdd;
        });
        this.otherUserList = new ShoppingList("otherUser test list", Date.valueOf("2022-11-17"), otherUser);
        listRepository.save(this.otherUserList);
        this.otherUserItem = new Item();
        this.otherUserItem.setText("otherUser test item");
        this.otherUserItem.setQuantity(2.0f);
        this.otherUserItem.setUnit(Units.COUNT);
        this.otherUserItem.setList(this.otherUserList);
        this.otherUserItem.setUser(otherUser);
        itemRepository.save(this.otherUserItem);

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

    @Test
    @Order(2)
    @Transactional
    void testIntegrationUpdateList() throws Exception {
        Optional<List<Item>> items = itemRepository.findItemsByList(loggedUserList);
        assertTrue(items.isPresent());
        assertTrue(items.get().size() > 0);
        Item itemToUpdate = items.get().get(0);

        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setText("test text updated");
        itemDTO.setQuantity(1.0f);
        itemDTO.setListId(this.loggedUserList.getId());
        itemDTO.setDone(true);

        MockMultipartFile itemInfo = new MockMultipartFile("itemInfo", "",
                "application/json", objectMapper.writeValueAsBytes(itemDTO));
        MockMultipartFile image = new MockMultipartFile("image", new byte[1]);

        MvcResult result = mockMvc.perform(multipart("/api/item/update/" + itemToUpdate.getId())
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
                .andExpect(jsonPath("$.done").value(itemDTO.isDone()))
                .andReturn();

        String json = result.getResponse().getContentAsString();
        SingleItemResponse response = objectMapper.readValue(json, SingleItemResponse.class);
        Item updatedItem = itemRepository.getReferenceById(response.getId());
        assertTrue(itemRepository.existsById(response.getId()));
        assertEquals(itemDTO.getText(), updatedItem.getText());
        assertEquals(itemDTO.getQuantity(), updatedItem.getQuantity());
        assertEquals(itemDTO.getUnit(), updatedItem.getUnit());
        assertEquals(itemDTO.isDone(), updatedItem.isDone());
    }

    @Test
    @Order(3)
    @Transactional
    void testIntegrationGetAllItems() throws Exception {
        Optional<ShoppingList> list = listRepository.findById(loggedUserList.getId());
        assertTrue(list.isPresent());
        assertTrue(list.get().getItems().size() > 0);

        MvcResult result = mockMvc.perform(get("/api/item/all/" + loggedUserList.getId())
                .cookie(this.cookie)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.listId").value(loggedUserList.getId()))
                .andExpect(jsonPath("$.listName").value(loggedUserList.getName()))
                .andExpect(jsonPath("$.date").value(loggedUserList.getDate().toString()))
                .andExpect(jsonPath("$.items").isArray())
                .andReturn();

        String json = result.getResponse().getContentAsString();
        ItemsResponse response = objectMapper.readValue(json, ItemsResponse.class);

        assertTrue(response.getItems().size() > 0);
    }

    @Test
    @Order(4)
    @Transactional
    void testIntegrationDeleteItem() throws Exception {
        Optional<List<Item>> items = itemRepository.findItemsByList(loggedUserList);
        assertTrue(items.isPresent());
        assertTrue(items.get().size() > 0);
        Item itemToDelete = items.get().get(0);

        mockMvc.perform(delete("/api/item/delete/" + itemToDelete.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .cookie(this.cookie)
                .with(csrf()))
                .andExpect(status().isOk());

        assertFalse(itemRepository.existsById(itemToDelete.getId()));
    }

    @Test
    @Order(5)
    @Transactional
    void testIntegrationDeleteItemWhichNotBelongToLoggedUser() throws Exception {
        mockMvc.perform(delete("/api/item/delete/" + otherUserItem.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .cookie(this.cookie)
                .with(csrf()))
                .andExpect(status().isBadRequest());

        assertTrue(itemRepository.existsById(otherUserItem.getId()));
    }

    @Test
    @Order(6)
    @Transactional
    void testIntegrationUpdateItemWhichNotBelongToLoggedUser() throws Exception {
        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setText("test text updated");
        itemDTO.setQuantity(1.0f);
        itemDTO.setListId(this.otherUserList.getId());
        itemDTO.setDone(true);

        mockMvc.perform(post("/api/item/update/" + otherUserItem.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(itemDTO))
                .cookie(this.cookie)
                .with(csrf()))
                .andExpect(status().is4xxClientError());

        assertTrue(listRepository.existsById(otherUserList.getId()));
    }

    @Test
    @Order(7)
    @Transactional
    void testIntegrationUpdateItemThatNotExists() throws Exception {
        Long id = 999999L;
        assertFalse(itemRepository.existsById(id));

        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setText("test text updated");
        itemDTO.setQuantity(1.0f);
        itemDTO.setListId(this.loggedUserList.getId());
        itemDTO.setDone(true);

        mockMvc.perform(post("/api/item/update/" + id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(itemDTO))
                .cookie(this.cookie)
                .with(csrf()))
                .andExpect(status().is4xxClientError());

        assertFalse(itemRepository.existsById(id));
    }

    @Test
    @Order(5)
    @Transactional
    void testIntegrationGetItemsFromListWhichNotBelongToLoggedUser() throws Exception {
        mockMvc.perform(get("/api/item/all/" + otherUserList.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .cookie(this.cookie)
                .with(csrf()))
                .andExpect(status().isBadRequest());
    }

}
