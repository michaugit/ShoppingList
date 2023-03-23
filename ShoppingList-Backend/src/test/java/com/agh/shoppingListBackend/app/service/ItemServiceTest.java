package com.agh.shoppingListBackend.app.service;

import com.agh.shoppingListBackend.app.enums.Units;
import com.agh.shoppingListBackend.app.exepction.ForbiddenException;
import com.agh.shoppingListBackend.app.exepction.NotFoundException;
import com.agh.shoppingListBackend.app.models.Item;
import com.agh.shoppingListBackend.app.models.ShoppingList;
import com.agh.shoppingListBackend.app.models.User;
import com.agh.shoppingListBackend.app.payload.response.ItemsResponse;
import com.agh.shoppingListBackend.app.payload.response.SingleItemResponse;
import com.agh.shoppingListBackend.app.repository.ItemRepository;
import com.agh.shoppingListBackend.app.repository.ListRepository;
import com.agh.shoppingListBackend.app.repository.PriceRepository;
import com.agh.shoppingListBackend.app.repository.UserRepository;
import com.agh.shoppingListBackend.app.security.services.UserDetailsImpl;
import com.agh.shoppingListBackend.app.services.ItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.sql.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {


    @Mock
    private ItemRepository itemRepository;

    @Mock
    private PriceRepository priceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ListRepository listRepository;

    private ItemService itemService;


    private User user;
    private ShoppingList list;
    private Item item;


    @BeforeEach
    void setUp() {
        ModelMapper modelMapper = new ModelMapper();
        itemService = new ItemService(userRepository, itemRepository, priceRepository, listRepository, modelMapper);
        user = new User("user", "pass");
        list = new ShoppingList("testList", Date.valueOf("2022-11-17"), user);
        list.setId(2L);
        item = new Item();
        item.setId(1L);
        item.setList(list);
        item.setUser(user);
        item.setText("testText");
        item.setQuantity(1.0f);
        item.setUnit(Units.COUNT);
        item.setDone(false);
        item.setImage(null);

        UserDetailsImpl applicationUser = UserDetailsImpl.build(user);
        Authentication authentication = Mockito.mock(Authentication.class);
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        lenient().when(SecurityContextHolder.getContext().getAuthentication().getPrincipal()).thenReturn(applicationUser);
    }


    @Test
    void testAddItem() {
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
        when(listRepository.findById(list.getId())).thenReturn(Optional.of(list));

        SingleItemResponse response = itemService.addItem(item, list.getId());

        verify(itemRepository).save(any(Item.class));
        assertNotNull(response);
    }


    @Test
    void testAddItemWithImage() throws IOException {
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
        when(listRepository.findById(list.getId())).thenReturn(Optional.of(list));
        MockMultipartFile image = new MockMultipartFile("image", new byte[1]);

        SingleItemResponse response = itemService.addItem(item, list.getId(), image);

        verify(itemRepository).save(any(Item.class));
        assertNotNull(response);
    }

    @Test
    void testAddItemToOtherUser() {
        User otherUser = new User("user2", "pass2");
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(otherUser));
        when(listRepository.findById(list.getId())).thenReturn(Optional.of(list));

        assertThrows(ForbiddenException.class, () ->
                itemService.addItem(item, list.getId()));
    }

    @Test
    void testAddItemToNonExitsList() {
        assertThrows(NotFoundException.class, () ->
                itemService.addItem(item, list.getId()));
    }

    @Test
    void testUpdateItem() {
        Item updateItem = new Item();
        updateItem.setImage(null);
        updateItem.setDone(true);
        updateItem.setText("otherText");
        updateItem.setUnit(Units.KG);
        updateItem.setQuantity(2.5f);
        updateItem.setList(list);

        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
        when(itemRepository.findById(item.getId())).thenReturn(Optional.of(item));

        SingleItemResponse response = itemService.updateItem(item.getId(), updateItem);

        verify(itemRepository).save(any(Item.class));
        assertNotNull(response);
        assertEquals(updateItem.getText(), item.getText());
        assertEquals(updateItem.getQuantity(), item.getQuantity());
        assertEquals(updateItem.getUnit(), item.getUnit());
        assertEquals(updateItem.getImage(), item.getImage());
        assertEquals(updateItem.getList(), item.getList());
        assertEquals(updateItem.isDone(), item.isDone());
    }

    @Test
    void testUpdateNonExistingItem() {
        Item updateItem = new Item();
        assertThrows(NotFoundException.class, () -> itemService.updateItem(item.getId(), updateItem));
    }

    @Test
    void testUpdateItemWithImage() throws IOException {
        MockMultipartFile image = new MockMultipartFile("image", new byte[1]);
        Item updateItem = new Item();
        updateItem.setImage(null);
        updateItem.setDone(true);
        updateItem.setText("otherText");
        updateItem.setUnit(Units.KG);
        updateItem.setQuantity(2.5f);
        updateItem.setList(list);

        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
        when(itemRepository.findById(item.getId())).thenReturn(Optional.of(item));

        SingleItemResponse response = itemService.updateItem(item.getId(), updateItem, image);

        verify(itemRepository).save(any(Item.class));
        assertNotNull(response);
        assertEquals(updateItem.getText(), item.getText());
        assertEquals(updateItem.getQuantity(), item.getQuantity());
        assertEquals(updateItem.getUnit(), item.getUnit());
        assertEquals(updateItem.getImage(), item.getImage());
        assertEquals(updateItem.getList(), item.getList());
        assertEquals(updateItem.isDone(), item.isDone());
    }


    @Test
    void testUpdateItemWhichNotBelongToUser() {
        User otherUser = new User("user2", "pass2");
        Item updateItem = new Item();

        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(otherUser));
        when(itemRepository.findById(item.getId())).thenReturn(Optional.of(item));

        assertThrows(ForbiddenException.class, () -> itemService.updateItem(item.getId(), updateItem));
    }

    @Test
    void testUpdateItemWhichBelongToDifferentList() {
        ShoppingList otherList = new ShoppingList("otherTestList", Date.valueOf("2022-11-16"), user);
        otherList.setId(3L);
        Item updateItem = new Item();
        updateItem.setList(otherList);

        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
        when(itemRepository.findById(item.getId())).thenReturn(Optional.of(item));

        assertThrows(ForbiddenException.class, () -> itemService.updateItem(item.getId(), updateItem));
    }

    @Test
    void testDeleteItem() {
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
        when(itemRepository.findById(item.getId())).thenReturn(Optional.of(item));
        itemService.deleteItem(1L);
        verify(itemRepository).delete(any(Item.class));
    }

    @Test
    void testDeleteItemWhichNotBelongToUser() {
        User otherUser = new User("user2", "pass2");
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(otherUser));
        when(itemRepository.findById(item.getId())).thenReturn(Optional.of(item));
        assertThrows(ForbiddenException.class, () -> itemService.deleteItem(1L));
    }

    @Test
    void testGetAllItemsByListId() {
        when(userRepository.findByUsername(user.getUsername())).thenReturn(Optional.of(user));
        when(listRepository.findById(list.getId())).thenReturn(Optional.of(list));
        when(itemRepository.findItemsByList(list)).thenReturn(Optional.of(List.of(item)));

        ItemsResponse response = itemService.getAllItemsByListId(list.getId());

        verify(itemRepository).findItemsByList(any(ShoppingList.class));
        assertNotNull(response);
        assertTrue(response.getItems().size() > 0);
        assertEquals(response.getItems().get(0).getText(), item.getText());
        assertEquals(response.getItems().get(0).getQuantity(), item.getQuantity());
        assertEquals(response.getItems().get(0).getUnit(), item.getUnit());
        assertEquals(response.getItems().get(0).getImage(), item.getImage());
    }

}
