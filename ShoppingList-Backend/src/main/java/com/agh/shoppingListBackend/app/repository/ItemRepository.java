package com.agh.shoppingListBackend.app.repository;

import com.agh.shoppingListBackend.app.models.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
}
