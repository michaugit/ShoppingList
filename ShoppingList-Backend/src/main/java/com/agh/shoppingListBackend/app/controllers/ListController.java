package com.agh.shoppingListBackend.app.controllers;

import com.agh.shoppingListBackend.app.payload.request.ListRequest;
import com.agh.shoppingListBackend.app.payload.response.MessageResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/list")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ListController {

    private static final Logger logger = LoggerFactory.getLogger(ListController.class);

    @PostMapping( path ="/add")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addList(@Valid @RequestBody ListRequest listRequest){
        logger.warn(listRequest.getName() + listRequest.getDate());
        return ResponseEntity.ok(new MessageResponse("OK"));
    }
}
