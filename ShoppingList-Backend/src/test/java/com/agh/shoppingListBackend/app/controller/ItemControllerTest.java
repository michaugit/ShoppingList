package com.agh.shoppingListBackend.app.controller;

import com.agh.shoppingListBackend.app.controllers.ItemController;
import com.agh.shoppingListBackend.app.models.Item;
import com.agh.shoppingListBackend.app.payload.request.ItemDTO;
import com.agh.shoppingListBackend.app.payload.response.ItemsResponse;
import com.agh.shoppingListBackend.app.payload.response.SingleItemResponse;
import com.agh.shoppingListBackend.app.services.ItemService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.io.IOException;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ItemController.class)
class ItemControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @MockBean
    private ModelMapper modelMapper;

    private ObjectMapper objectMapper;

    @MockBean
    private ItemService testItemService;


    @BeforeEach
    void setUp() {
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(this.context)
                .apply(springSecurity())
                .build();
        objectMapper = new ObjectMapper();
    }


    @Test
    @WithMockUser
    void testAddItemWithoutImage() throws Exception {
        Long listId = 1L;
        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setText("testList");
        itemDTO.setListId(listId);
        Item item = modelMapper.map(itemDTO, Item.class);

        when(testItemService.addItem(item, listId)).thenReturn(new SingleItemResponse());


        MockMultipartFile itemInfo = new MockMultipartFile("itemInfo", "",
                "application/json", objectMapper.writeValueAsBytes(itemDTO));

        mockMvc.perform(multipart("/api/item/add")
                .file(itemInfo)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(objectMapper.writeValueAsString(new SingleItemResponse())));

        verify(testItemService).addItem(item, listId);
    }

    @Test
    @WithMockUser
    void testAddItemWithImage() throws Exception {
        Long listId = 1L;
        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setText("testList");
        itemDTO.setListId(listId);
        Item item = modelMapper.map(itemDTO, Item.class);

        MockMultipartFile itemInfo = new MockMultipartFile("itemInfo", "",
                "application/json", objectMapper.writeValueAsBytes(itemDTO));
        MockMultipartFile image = new MockMultipartFile("image", new byte[1]);

        when(testItemService.addItem(item, listId, image)).thenReturn(new SingleItemResponse());

        mockMvc.perform(multipart("/api/item/add")
                .file(itemInfo)
                .file(image)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(objectMapper.writeValueAsString(new SingleItemResponse())));

        verify(testItemService).addItem(item, listId, image);
    }

    @Test
    @WithMockUser
    void testAddItemWithImageException() throws Exception {
        Long listId = 1L;
        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setText("testList");
        itemDTO.setListId(listId);
        Item item = modelMapper.map(itemDTO, Item.class);

        MockMultipartFile itemInfo = new MockMultipartFile("itemInfo", "",
                "application/json", objectMapper.writeValueAsBytes(itemDTO));
        MockMultipartFile image = new MockMultipartFile("image", new byte[1]);

        when(testItemService.addItem(item, listId, image)).thenThrow(new IOException());

        mockMvc.perform(multipart("/api/item/add")
                .file(itemInfo)
                .file(image)
                .with(csrf()))
                .andExpect(status().isExpectationFailed())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(testItemService).addItem(item, listId, image);
    }


    @Test
    @WithMockUser
    void testUpdateWithoutImage() throws Exception {
        Long itemId = 1L;
        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setText("testList");
        itemDTO.setListId(2L);
        Item item = modelMapper.map(itemDTO, Item.class);

        MockMultipartFile itemInfo = new MockMultipartFile("itemInfo", "",
                "application/json", objectMapper.writeValueAsBytes(itemDTO));

        when(testItemService.updateItem(itemId, item)).thenReturn(new SingleItemResponse());

        mockMvc.perform(multipart("/api/item/update/{id}", itemId)
                .file(itemInfo)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(objectMapper.writeValueAsString(new SingleItemResponse())));

        verify(testItemService).updateItem(itemId, item);
    }

    @Test
    @WithMockUser
    void testUpdateItemWithImage() throws Exception {
        Long itemId = 1L;
        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setText("testList");
        itemDTO.setListId(2L);
        Item item = modelMapper.map(itemDTO, Item.class);


        MockMultipartFile itemInfo = new MockMultipartFile("itemInfo", "",
                "application/json", objectMapper.writeValueAsBytes(itemDTO));
        MockMultipartFile image = new MockMultipartFile("image", new byte[1]);

        when(testItemService.updateItem(itemId, item, image)).thenReturn(new SingleItemResponse());

        mockMvc.perform(multipart("/api/item/update/{id}", itemId)
                .file(itemInfo)
                .file(image)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(objectMapper.writeValueAsString(new SingleItemResponse())));

        verify(testItemService).updateItem(itemId, item, image);
    }

    @Test
    @WithMockUser
    void testUpdateItemWithImageException() throws Exception {
        Long itemId = 1L;
        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setText("testList");
        itemDTO.setListId(2L);
        Item item = modelMapper.map(itemDTO, Item.class);


        MockMultipartFile itemInfo = new MockMultipartFile("itemInfo", "",
                "application/json", objectMapper.writeValueAsBytes(itemDTO));
        MockMultipartFile image = new MockMultipartFile("image", new byte[1]);

        when(testItemService.updateItem(itemId, item, image)).thenThrow(new IOException());

        mockMvc.perform(multipart("/api/item/update/{id}", itemId)
                .file(itemInfo)
                .file(image)
                .with(csrf()))
                .andExpect(status().isExpectationFailed())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(testItemService).updateItem(itemId, item, image);
    }

    @Test
    @WithMockUser
    void testDeleteList() throws Exception {
        Long id = 1L;

        doNothing().when(testItemService).deleteItem(id);

        mockMvc.perform(delete("/api/item/delete/{id}", id)
                .with(csrf()))
                .andExpect(status().isOk());

        verify(testItemService).deleteItem(id);
    }


    @Test
    @WithMockUser
    void testGetAllLists() throws Exception {
        Long listId = 1L;

        when(testItemService.getAllItemsByListId(listId)).thenReturn(new ItemsResponse());

        mockMvc.perform(get("/api/item/all/{list_id}", listId)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(objectMapper.writeValueAsString(new ItemsResponse())));

        verify(testItemService).getAllItemsByListId(listId);
    }
}
