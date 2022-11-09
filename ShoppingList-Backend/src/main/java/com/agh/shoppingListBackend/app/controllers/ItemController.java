package com.agh.shoppingListBackend.app.controllers;

import com.agh.shoppingListBackend.app.models.Item;
import com.agh.shoppingListBackend.app.payload.request.ItemDTO;
import com.agh.shoppingListBackend.app.payload.response.ItemsResponse;
import com.agh.shoppingListBackend.app.payload.response.ListsResponse;
import com.agh.shoppingListBackend.app.payload.response.MessageResponse;
import com.agh.shoppingListBackend.app.services.ItemService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.websocket.server.PathParam;

@RestController
@RequestMapping("/api/item")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ItemController {

    private static final Logger logger = LoggerFactory.getLogger(ListController.class);
    private final ItemService itemService;
    private ModelMapper modelMapper;
    private MessageSource messageSource;


    @Autowired
    public ItemController(ItemService itemService, ModelMapper modelMapper, MessageSource messageSource){
        this.itemService = itemService;
        this.modelMapper = modelMapper;
        this.messageSource = messageSource;
    }

    @PostMapping( path ="/add")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addItem(@Valid @RequestBody ItemDTO itemDTO){
        Item item = mapItemDTOtoItem(itemDTO);
        itemService.addItem(item, itemDTO.getListId());
        return ResponseEntity.ok( new MessageResponse(messageSource.getMessage("success.addItem", null, LocaleContextHolder.getLocale())));
    }

    @PostMapping( path ="/update/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateItem(@Valid @RequestBody ItemDTO itemDTO,  @PathVariable(value = "id") Long itemId){
        itemService.updateItem(itemId, itemDTO);
        return ResponseEntity.ok( new MessageResponse(messageSource.getMessage("success.updateItem", null, LocaleContextHolder.getLocale())));
    }

    @DeleteMapping( path ="/delete/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteItem(@PathVariable(value = "id") Long itemId){
        itemService.deleteItem(itemId);
        return ResponseEntity.ok( new MessageResponse(messageSource.getMessage("success.deleteItem", null, LocaleContextHolder.getLocale())));
    }

    @GetMapping( path = "/all/{list_id}" )
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getAllItems(@PathVariable(value = "list_id") Long listId ){
        ItemsResponse itemsResponse = itemService.getAllItemsByListId(listId);
        return ResponseEntity.ok(itemsResponse);
    }
    
    private Item mapItemDTOtoItem(ItemDTO itemDTO){
        return this.modelMapper.map(itemDTO, Item.class);
    }
}
