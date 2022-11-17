package com.agh.shoppingListBackend.app.repository;

import com.agh.shoppingListBackend.app.enums.RoleEnum;
import com.agh.shoppingListBackend.app.models.Role;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;


import static org.junit.jupiter.api.Assertions.assertEquals;

@DataJpaTest
public class RoleRepositoryTest {
    @Autowired
    private RoleRepository roleRepository;


    @AfterEach
    void clear(){
        roleRepository.deleteAll();
    }

    @Test
    void testFindByName(){
        Role role = new Role();
        role.setName(RoleEnum.ROLE_USER);
        roleRepository.save(role);
        Role result = roleRepository.findByName(RoleEnum.ROLE_USER).orElse(null);
        assertEquals(result, role);
    }

}