package com.agh.shoppingListBackend.app.service;

import com.agh.shoppingListBackend.app.exepction.ForbiddenException;
import com.agh.shoppingListBackend.app.exepction.NotFoundException;
import com.agh.shoppingListBackend.app.models.ShoppingList;
import com.agh.shoppingListBackend.app.models.User;
import com.agh.shoppingListBackend.app.payload.response.ListsResponse;
import com.agh.shoppingListBackend.app.payload.response.SimpleListResponse;
import com.agh.shoppingListBackend.app.repository.ItemRepository;
import com.agh.shoppingListBackend.app.repository.ListRepository;
import com.agh.shoppingListBackend.app.repository.UserRepository;
import com.agh.shoppingListBackend.app.security.services.UserDetailsImpl;
import com.agh.shoppingListBackend.app.services.ListService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.sql.Date;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ListServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ListRepository listRepository;

    @Mock
    private ItemRepository itemRepository;

    private ListService listService;

    private User user;
    private ShoppingList list;

    @BeforeEach
    void setUp() {
        ModelMapper modelMapper = new ModelMapper();
        listService = new ListService(userRepository, listRepository, itemRepository, modelMapper);
        user = new User("user", "pass");
        list = new ShoppingList("testList", Date.valueOf("2022-11-17"), user);
        list.setId(2L);
        list.setItems(Collections.emptySet());

        UserDetailsImpl applicationUser = UserDetailsImpl.build(user);
        Authentication authentication = Mockito.mock(Authentication.class);
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        lenient().when(SecurityContextHolder.getContext().getAuthentication().getPrincipal()).thenReturn(applicationUser);
    }


    @Test
    void testAddList() {
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));

        SimpleListResponse response = listService.addList(list);

        verify(listRepository).save(any(ShoppingList.class));
        assertNotNull(response);
    }

    @Test
    void testUpdateList() {
        ShoppingList updateList = new ShoppingList("updateList", Date.valueOf("2022-11-18"), user);

        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
        when(listRepository.findById(list.getId())).thenReturn(Optional.of(list));

        SimpleListResponse response = listService.updateList(list.getId(), updateList);

        verify(listRepository).save(any(ShoppingList.class));
        assertNotNull(response);
        assertEquals(response.getName(), updateList.getName());
        assertEquals(response.getDate(), updateList.getDate().toString());
    }


    @Test
    void testUpdateListNotBelongToUser() {
        User otherUser = new User("user2", "pass2");
        ShoppingList updateList = new ShoppingList("updateList", Date.valueOf("2022-11-17"), user);

        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(otherUser));
        when(listRepository.findById(list.getId())).thenReturn(Optional.of(list));

        assertThrows(ForbiddenException.class, () -> listService.updateList(list.getId(), updateList));
    }

    @Test
    void testUpdateListWhichNotExists() {
        ShoppingList updateList = new ShoppingList("updateList", Date.valueOf("2022-11-17"), user);
        when(listRepository.findById(list.getId())).thenThrow(new NotFoundException("exception.listNotFound"));

        assertThrows(NotFoundException.class, () -> listService.updateList(list.getId(), updateList));
    }

    @Test
    void testDeleteList() {
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
        when(listRepository.findById(list.getId())).thenReturn(Optional.of(list));
        listService.deleteList(list.getId());
        verify(listRepository).delete(any(ShoppingList.class));
    }

    @Test
    void testDeleteListWhichNotBelongToUser() {
        User otherUser = new User("user2", "pass2");
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(otherUser));
        when(listRepository.findById(list.getId())).thenReturn(Optional.of(list));

        assertThrows(ForbiddenException.class, () -> listService.deleteList(list.getId()));
    }

    @Test
    void testGetAllLists() {
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
        when(listRepository.findListsByUser(user)).thenReturn(Optional.of(List.of(list)));

        ListsResponse response = listService.getAllLists();

        verify(listRepository).findListsByUser(any(User.class));
        assertNotNull(response);
        assertTrue(response.getShoppingLists().size() > 0);
        assertEquals(response.getShoppingLists().get(0).getName(), list.getName());
        assertEquals(response.getShoppingLists().get(0).getDate(), list.getDate().toString());
    }
}
