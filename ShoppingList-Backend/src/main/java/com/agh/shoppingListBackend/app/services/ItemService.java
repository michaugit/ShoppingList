package com.agh.shoppingListBackend.app.services;

import com.agh.shoppingListBackend.app.exepction.ForbiddenException;
import com.agh.shoppingListBackend.app.exepction.NotFoundException;
import com.agh.shoppingListBackend.app.models.Item;
import com.agh.shoppingListBackend.app.models.ShoppingList;
import com.agh.shoppingListBackend.app.models.User;
import com.agh.shoppingListBackend.app.payload.request.ItemDTO;
import com.agh.shoppingListBackend.app.payload.response.ItemsResponse;
import com.agh.shoppingListBackend.app.payload.response.SingleItemResponse;
import com.agh.shoppingListBackend.app.repository.ItemRepository;
import com.agh.shoppingListBackend.app.repository.ListRepository;
import com.agh.shoppingListBackend.app.repository.UserRepository;
import com.agh.shoppingListBackend.app.security.services.UserDetailsImpl;
import com.agh.shoppingListBackend.app.utils.ImageConverter;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Arrays;
import java.util.Comparator;
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
        modelMapper.addMappings(new PropertyMap<ItemDTO, Item>() {
            @Override
            protected void configure() {
                skip(destination.getImage());
            }
        });
    }


    @Transactional
    public SingleItemResponse addItem(Item item, Long listId){
        ShoppingList list = getListById(listId);
        User user = getCurrentUser();

        if(!list.getUser().equals(user)){
            throw new ForbiddenException("exception.itemNotBelongToUser");
        }

        item.setList(list);
        item.setUser(user);
        itemRepository.save(item);
        return mapItemToSingleItemResponse(item);
    }

    @Transactional
    public SingleItemResponse addItem(Item item, Long listId, MultipartFile image ) throws IOException {
        item.setImage(ImageConverter.compressBytes(image.getBytes()));
        return addItem(item, listId);
    }

    @Transactional
    public SingleItemResponse updateItem(Long itemId, Item updatedItem){
        Item item = getItemById(itemId);
        User user = getCurrentUser();

        if(!item.getUser().equals(user)){
            throw new ForbiddenException("exception.itemNotBelongToUser");
        }

        if(!Objects.equals(item.getList().getId(), updatedItem.getList().getId())){
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

        if(!Objects.equals(item.isDone(), updatedItem.isDone())){
            item.setDone(updatedItem.isDone());
        }

        if(!Arrays.equals(item.getImage(), updatedItem.getImage())){
            item.setImage(updatedItem.getImage());
        }

        itemRepository.save(item);
        return mapItemToSingleItemResponse(item);
    }

    @Transactional
    public SingleItemResponse updateItem(Long itemId, Item updatedItem, MultipartFile image) throws IOException {
        updatedItem.setImage(ImageConverter.compressBytes(image.getBytes()));
        return updateItem(itemId, updatedItem);
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
        itemsResponse.setListId(list.getId());
        itemsResponse.setListName(list.getName());
        itemsResponse.setDate(list.getDate().toString());

        itemRepository.findItemsByList(list).ifPresent(
                items -> itemsResponse.setItems(
                        items.stream()
                                .sorted(Comparator.comparing(Item::getId))
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
                () -> new NotFoundException("exception.listNotFound")
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
        SingleItemResponse singleItemResponse = this.modelMapper.map(item, SingleItemResponse.class);
        if(item.getImage() != null) {
            singleItemResponse.setImage(ImageConverter.decompressBytes(item.getImage()));
        }
        return singleItemResponse;
    }

}
