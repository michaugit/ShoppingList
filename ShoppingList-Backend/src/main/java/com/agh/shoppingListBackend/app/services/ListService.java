package com.agh.shoppingListBackend.app.services;


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
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ListService {
    private final UserRepository userRepository;
    private final ListRepository listRepository;
    private final ItemRepository itemRepository;
    private final ModelMapper modelMapper;


    @Autowired
    public ListService(UserRepository userRepository, ListRepository listRepository, ItemRepository itemRepository, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.listRepository = listRepository;
        this.itemRepository = itemRepository;
        this.modelMapper = modelMapper;
    }


    @Transactional
    public SimpleListResponse addList(ShoppingList list) {
        User user = getCurrentUser();
        list.setUser(user);
        listRepository.save(list);
        return mapShoppingListToSingleListResponse(list);
    }

    @Transactional
    public SimpleListResponse updateList(Long listId, ShoppingList updatedList) {
        ShoppingList list = getListById(listId);
        User user = getCurrentUser();

        if (!list.getUser().equals(user)) {
            throw new ForbiddenException("exception.listNotBelongToUser");
        }

        if (!Objects.equals(list.getName(), updatedList.getName())) {
            list.setName(updatedList.getName());
        }

        if (!Objects.equals(list.getDate(), updatedList.getDate())) {
            list.setDate(updatedList.getDate());
        }

        listRepository.save(list);
        return mapShoppingListToSingleListResponse(list);
    }


    @Transactional
    public void deleteList(Long listId) {
        ShoppingList list = getListById(listId);
        User user = getCurrentUser();

        if (!list.getUser().equals(user)) {
            throw new ForbiddenException("exception.listNotBelongToUser");
        }

        list.getItems().forEach(itemRepository::delete);
        listRepository.delete(list);
    }

    @Transactional
    public ListsResponse getAllLists() {
        User user = getCurrentUser();
        ListsResponse listsResponse = new ListsResponse();

        listRepository.findListsByUser(user).ifPresent(
                lists -> listsResponse.setShoppingLists(
                                lists.stream()
                                        .sorted(Comparator.comparing(ShoppingList::getId))
                                        .map(this::mapShoppingListToSingleListResponse)
                                        .collect(Collectors.toList())));
        return listsResponse;
    }

    private ShoppingList getListById(Long id) {
        return listRepository.findById(id).orElseThrow(
                () -> new NotFoundException("exception.listNotFound")
        );
    }

    private User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        String username = userDetails.getUsername();
        return userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("Cannot found user"));
    }

    private SimpleListResponse mapShoppingListToSingleListResponse(ShoppingList list) {
        return this.modelMapper.map(list, SimpleListResponse.class);
    }
}
