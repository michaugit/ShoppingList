package com.agh.shoppingListBackend.app.controller;

import com.agh.shoppingListBackend.app.controllers.ListController;
import com.agh.shoppingListBackend.app.models.ShoppingList;
import com.agh.shoppingListBackend.app.payload.request.ListDTO;
import com.agh.shoppingListBackend.app.payload.response.ListsResponse;
import com.agh.shoppingListBackend.app.payload.response.SimpleListResponse;
import com.agh.shoppingListBackend.app.services.ListService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ListController.class)
class ListControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext context;

    @MockBean
    private ModelMapper modelMapper;

    private ObjectMapper objectMapper;

    @MockBean
    private ListService testListService;


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
    void testAddList() throws Exception {
        ListDTO listDTO = new ListDTO();
        listDTO.setName("testList");
        listDTO.setDate("2022-11-16");
        ShoppingList list = modelMapper.map(listDTO, ShoppingList.class);

        when(testListService.addList(list)).thenReturn(new SimpleListResponse());

        mockMvc.perform(post("/api/list/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(listDTO))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(objectMapper.writeValueAsString(new SimpleListResponse())));

        verify(testListService).addList(list);
    }

    @Test
    @WithMockUser
    void testUpdateList() throws Exception {
        Long id = 1L;
        ListDTO listDTO = new ListDTO();
        listDTO.setName("testList");
        listDTO.setDate("2022-11-16");
        ShoppingList list = modelMapper.map(listDTO, ShoppingList.class);

        when(testListService.updateList(1L, list)).thenReturn(new SimpleListResponse());

        mockMvc.perform(post("/api/list/update/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(listDTO))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(objectMapper.writeValueAsString(new SimpleListResponse())));

        verify(testListService).updateList(id, list);
    }

    @Test
    @WithMockUser
    void testDeleteList() throws Exception {
        Long id = 1L;

        doNothing().when(testListService).deleteList(id);

        mockMvc.perform(delete("/api/list/delete/{id}", id)
                .with(csrf()))
                .andExpect(status().isOk());

        verify(testListService).deleteList(id);
    }


    @Test
    @WithMockUser
    void testGetAllLists() throws Exception {

        when(testListService.getAllLists()).thenReturn(new ListsResponse());

        mockMvc.perform(get("/api/list/all")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string(objectMapper.writeValueAsString(new ListsResponse())));

        verify(testListService).getAllLists();
    }


}
