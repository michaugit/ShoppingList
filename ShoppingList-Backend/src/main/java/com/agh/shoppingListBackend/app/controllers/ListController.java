package com.agh.shoppingListBackend.app.controllers;

import com.agh.shoppingListBackend.app.models.List;
import com.agh.shoppingListBackend.app.payload.request.ListDTO;
import com.agh.shoppingListBackend.app.payload.response.MessageResponse;
import com.agh.shoppingListBackend.app.services.ListService;
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

@RestController
@RequestMapping("/api/list")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ListController {

    private static final Logger logger = LoggerFactory.getLogger(ListController.class);
    private final ListService listService;
    private ModelMapper modelMapper;
    private MessageSource messageSource;

    @Autowired
    public ListController(ListService listService, ModelMapper modelMapper, MessageSource messageSource){
        this.listService = listService;
        this.modelMapper = modelMapper;
        this.messageSource = messageSource;
    }

    @PostMapping( path ="/add")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addList(@Valid @RequestBody ListDTO listDTO){
        List list = mapListDTOtoList(listDTO);
        listService.addList(list);
        return ResponseEntity.ok( new MessageResponse(messageSource.getMessage("success.addList", null, LocaleContextHolder.getLocale())));
    }

    @PostMapping( path ="/update/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateList(@Valid @RequestBody ListDTO listDTO,  @PathVariable(value = "id") Long listId){
        List list = mapListDTOtoList(listDTO);
        listService.updateList(listId, list);
        return ResponseEntity.ok( new MessageResponse(messageSource.getMessage("success.updateList", null, LocaleContextHolder.getLocale())));
    }

    @DeleteMapping( path ="/delete/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteList(@PathVariable(value = "id") Long listId){
        listService.deleteList(listId);
        return ResponseEntity.ok( new MessageResponse(messageSource.getMessage("success.deleteList", null, LocaleContextHolder.getLocale())));
    }




    private List mapListDTOtoList(ListDTO listDTO){
        return this.modelMapper.map(listDTO, List.class);
    }
}
