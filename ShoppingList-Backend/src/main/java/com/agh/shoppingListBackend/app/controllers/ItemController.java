package com.agh.shoppingListBackend.app.controllers;

import com.agh.shoppingListBackend.app.models.Item;
import com.agh.shoppingListBackend.app.payload.request.ItemDTO;
import com.agh.shoppingListBackend.app.payload.response.ItemsResponse;
import com.agh.shoppingListBackend.app.payload.response.MessageResponse;
import com.agh.shoppingListBackend.app.payload.response.SingleItemResponse;
import com.agh.shoppingListBackend.app.services.ItemService;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import javax.websocket.server.PathParam;
import java.io.IOException;

@RestController
@RequestMapping("/api/item")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600, allowCredentials = "true")
public class ItemController {

    private static final Logger logger = LoggerFactory.getLogger(ListController.class);
    private final ItemService itemService;
    private final ModelMapper modelMapper;
    private final MessageSource messageSource;


    @Autowired
    public ItemController(ItemService itemService, ModelMapper modelMapper, MessageSource messageSource) {
        this.itemService = itemService;
        this.modelMapper = modelMapper;
        this.messageSource = messageSource;
        modelMapper.addMappings(new PropertyMap<ItemDTO, Item>() {
            @Override
            protected void configure() {
                skip(destination.getId());
                skip(destination.getList());
            }
        });
    }

    @PostMapping(path = "/add", consumes = {
            MediaType.APPLICATION_JSON_VALUE,
            MediaType.MULTIPART_FORM_DATA_VALUE
    })
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addItem(@RequestPart(name = "image", required = false) MultipartFile image,
                                     @RequestPart("itemInfo") ItemDTO itemDTO) {
        Item item = mapItemDTOtoItem(itemDTO);
        SingleItemResponse response;

        if (image != null) {
            try {
                response = itemService.addItem(item, itemDTO.getListId(), image);
            } catch (IOException e) {
                return ResponseEntity
                        .status(HttpStatus.EXPECTATION_FAILED)
                        .body(new MessageResponse(messageSource.getMessage(
                                "exception.cannotSaveImage", null, LocaleContextHolder.getLocale())));
            }
        } else {
            response = itemService.addItem(item, itemDTO.getListId());
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping(path = "/update/{id}", consumes = {
            MediaType.APPLICATION_JSON_VALUE,
            MediaType.MULTIPART_FORM_DATA_VALUE
    })
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateItem(@RequestPart(name = "image", required = false) MultipartFile image,
                                        @RequestPart("itemInfo") ItemDTO itemDTO,
                                        @PathVariable(value = "id") Long itemId) {
        try {
            Item item = mapItemDTOtoItem(itemDTO);
            SingleItemResponse response;

            if (image != null) {
                response = itemService.updateItem(itemId, item, image);

            } else {
                response = itemService.updateItem(itemId, item);
            }
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.EXPECTATION_FAILED)
                    .body(new MessageResponse(messageSource.getMessage(
                            "exception.cannotSaveImage", null, LocaleContextHolder.getLocale())));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(messageSource.getMessage(e.getMessage(), null, LocaleContextHolder.getLocale())));
        }
    }

    @DeleteMapping(path = "/delete/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteItem(@PathVariable(value = "id") Long itemId) {
        try {
            itemService.deleteItem(itemId);
            return ResponseEntity.ok(new MessageResponse(messageSource.getMessage("success.deleteItem", null, LocaleContextHolder.getLocale())));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(messageSource.getMessage(e.getMessage(), null, LocaleContextHolder.getLocale())));
        }
    }

    @GetMapping(path = "/all/{list_id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getAllItems(@PathVariable(value = "list_id") Long listId) {
        try {
            ItemsResponse itemsResponse = itemService.getAllItemsByListId(listId);
            return ResponseEntity.ok(itemsResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(messageSource.getMessage(e.getMessage(), null, LocaleContextHolder.getLocale())));
        }
    }

    private Item mapItemDTOtoItem(ItemDTO itemDTO) {
        return this.modelMapper.map(itemDTO, Item.class);
    }
}
