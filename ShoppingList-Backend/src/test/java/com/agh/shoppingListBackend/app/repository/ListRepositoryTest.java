package com.agh.shoppingListBackend.app.repository;

import com.agh.shoppingListBackend.app.models.ShoppingList;
import com.agh.shoppingListBackend.app.models.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.sql.Date;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
class ListRepositoryTest {
    @Autowired
    private ListRepository listRepository;

    @Autowired
    private UserRepository userRepository;


    @AfterEach
    void clear() {
        listRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void testFindListsByUser() {
        User user = new User("user", "pass");
        ShoppingList list = new ShoppingList("testList", Date.valueOf("2022-11-17"), user);

        userRepository.save(user);
        listRepository.save(list);

        List<ShoppingList> resultList = listRepository.findListsByUser(user).orElse(Collections.emptyList());

        assertTrue(resultList.size() > 0);
        assertEquals(resultList.get(0), list);
    }

}
