package com.agh.shoppingListBackend.app.services;


import com.agh.shoppingListBackend.app.exepction.ForbiddenException;
import com.agh.shoppingListBackend.app.exepction.NotFoundException;
import com.agh.shoppingListBackend.app.models.List;
import com.agh.shoppingListBackend.app.models.User;
import com.agh.shoppingListBackend.app.repository.ListRepository;
import com.agh.shoppingListBackend.app.repository.UserRepository;
import com.agh.shoppingListBackend.app.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Objects;

@Service
public class ListService {
    private final UserRepository userRepository;
    private final ListRepository listRepository;


    @Autowired
    public ListService(UserRepository userRepository, ListRepository listRepository){
        this.userRepository = userRepository;
        this.listRepository = listRepository;
    }


    @Transactional
    public void addList(List list){
        User user = getCurrentUser();
        list.setUser(user);
        listRepository.save(list);
    }

    @Transactional
    public void updateList(Long listId, List updatedList){
        List list = getListById(listId);
        User user = getCurrentUser();

        if(!list.getUser().equals(user)){
            throw new ForbiddenException("exception.listNotBelongToUser");
        }

        if(!Objects.equals(list.getName(), updatedList.getName())){
            list.setName(updatedList.getName());
        }

        if(!Objects.equals(list.getDate(), updatedList.getDate())){
            list.setDate(updatedList.getDate());
        }

        listRepository.save(list);
    }


    @Transactional
    public void deleteList(Long listId){
        List list = getListById(listId);
        User user = getCurrentUser();

        if(!list.getUser().equals(user)){
            throw new ForbiddenException("exception.listNotBelongToUser");
        }

        listRepository.delete(list);
    }

    public List getListById(Long id){
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
}
