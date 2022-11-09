package com.agh.shoppingListBackend.app.services;

import com.agh.shoppingListBackend.app.exepction.ForbiddenException;
import com.agh.shoppingListBackend.app.exepction.NotFoundException;
import com.agh.shoppingListBackend.app.models.Item;
import com.agh.shoppingListBackend.app.models.ShoppingList;
import com.agh.shoppingListBackend.app.models.User;
import com.agh.shoppingListBackend.app.payload.request.ItemDTO;
import com.agh.shoppingListBackend.app.payload.response.ItemsResponse;
import com.agh.shoppingListBackend.app.payload.response.SingleItemResponse;
import com.agh.shoppingListBackend.app.payload.response.SingleListResponse;
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
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ItemService {
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final ListRepository listRepository;
    private final ModelMapper modelMapper;


    @Autowired
    public ItemService(UserRepository userRepository, ItemRepository itemRepository, ListRepository listRepository, ModelMapper modelMapper){
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.listRepository = listRepository;
        this.modelMapper = modelMapper;
    }


    @Transactional
    public void addItem(Item item, Long listId){
        ShoppingList list = getListById(listId);
        User user = getCurrentUser();

        if(!list.getUser().equals(user)){
            throw new ForbiddenException("exception.itemNotBelongToUser");
        }

        item.setList(list);
        item.setUser(user);
        itemRepository.save(item);
    }

    @Transactional
    public void updateItem(Long itemId, ItemDTO updatedItem){
        Item item = getItemById(itemId);
        User user = getCurrentUser();

        if(!item.getUser().equals(user)){
            throw new ForbiddenException("exception.itemNotBelongToUser");
        }
        if(!Objects.equals(item.getList().getId(), updatedItem.getListId())){
            throw new ForbiddenException("exception.itemNotBelongToList");
        }

        if(!Objects.equals(item.getText(), updatedItem.getText())){
            item.setText(updatedItem.getText());
        }

        if(!Objects.equals(item.getQuantity(), updatedItem.getQuantity())){
            item.setQuantity(updatedItem.getQuantity());
        }

        if(!Objects.equals(item.getUnit(), updatedItem.getUnit())){
            item.setUnit(updatedItem.getUnit());
        }

//        if(!Objects.equals(item.getImage(), image){
//            item.setImage(image);
//        }

        itemRepository.save(item);
    }


    @Transactional
    public void deleteItem(Long itemId){
        Item item = getItemById(itemId);
        User user = getCurrentUser();

        if(!item.getUser().equals(user)){
            throw new ForbiddenException("exception.itemNotBelongToUser");
        }

        itemRepository.delete(item);
    }

    @Transactional
    public ItemsResponse getAllItemsByListId(Long listId) {
        User user = getCurrentUser();
        ShoppingList list = getListById(listId);

        if(!list.getUser().equals(user)){
            throw new ForbiddenException("exception.listNotBelongToUser");
        }

        ItemsResponse itemsResponse = new ItemsResponse();

        itemRepository.findItemsByList(list).ifPresent(
                items -> itemsResponse.setItems(
                        items.stream()
                        .map(this::mapItemToSingleItemResponse)
                        .collect(Collectors.toList())
                )
        );

        return itemsResponse;
    }



    private Item getItemById(Long id){
        return itemRepository.findById(id).orElseThrow(
                () -> new NotFoundException("exception.itemNotFound")
        );
    }

    private ShoppingList getListById(Long id){
        return listRepository.findById(id).orElseThrow(
                () -> new NotFoundException("exception.itemNotFound")
        );
    }

    private User getCurrentUser(){
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        String username = userDetails.getUsername();
        return userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("Cannot found user"));
    }

    private SingleItemResponse mapItemToSingleItemResponse(Item item) {
        return this.modelMapper.map(item, SingleItemResponse.class);
    }
}
