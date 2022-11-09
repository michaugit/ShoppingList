package com.agh.shoppingListBackend.app.repository;

import com.agh.shoppingListBackend.app.models.ShoppingList;
import com.agh.shoppingListBackend.app.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ListRepository extends JpaRepository<ShoppingList, Long> {
    @Transactional
    Optional<List<ShoppingList>> findListsByUser(User user);
}
