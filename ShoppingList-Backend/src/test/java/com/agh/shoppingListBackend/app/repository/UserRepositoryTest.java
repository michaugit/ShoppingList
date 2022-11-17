package com.agh.shoppingListBackend.app.repository;

import com.agh.shoppingListBackend.app.models.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;


    @AfterEach
    void clear(){
        userRepository.deleteAll();
    }

    @Test
    void testFindByUsername(){
        User user = new User("user", "pass");
        userRepository.save(user);
        User result = userRepository.findByUsername(user.getUsername()).orElse(null);
        assertEquals(result, user);
    }

    @Test
    void testExistsByUsername(){
        User user = new User("user", "pass");
        userRepository.save(user);
        Boolean result = userRepository.existsByUsername(user.getUsername());
        assertTrue(result);
    }

}