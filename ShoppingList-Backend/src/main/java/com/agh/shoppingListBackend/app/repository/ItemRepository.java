package com.agh.shoppingListBackend.app.repository;

import com.agh.shoppingListBackend.app.models.Item;
import com.agh.shoppingListBackend.app.models.ShoppingList;
import com.agh.shoppingListBackend.app.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    @Transactional
    Optional<List<Item>> findItemsByList(ShoppingList list);
}
