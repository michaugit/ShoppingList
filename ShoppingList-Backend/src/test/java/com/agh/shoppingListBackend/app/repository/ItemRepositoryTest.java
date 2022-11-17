package com.agh.shoppingListBackend.app.repository;

import com.agh.shoppingListBackend.app.enums.Units;
import com.agh.shoppingListBackend.app.models.Item;
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
public class ItemRepositoryTest {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ListRepository listRepository;

    @Autowired
    private UserRepository userRepository;


    @AfterEach
    void clear(){
        userRepository.deleteAll();
        itemRepository.deleteAll();
        listRepository.deleteAll();
    }

    @Test
    void testFindItemsByList(){
        User user = new User("user", "pass");
        ShoppingList list = new ShoppingList("testList", Date.valueOf("2022-11-17"), user);
        Item item = new Item();
        item.setList(list);
        item.setUser(user);
        item.setText("testText");
        item.setQuantity(1.0f);
        item.setUnit(Units.COUNT);
        item.setDone(false);
        item.setImage(null);

        userRepository.save(user);
        listRepository.save(list);
        itemRepository.save(item);

        List<Item> resultList = itemRepository.findItemsByList(list).orElse(Collections.emptyList());

        assertTrue(resultList.size() > 0);
        assertEquals(resultList.get(0), item);
    }

}
