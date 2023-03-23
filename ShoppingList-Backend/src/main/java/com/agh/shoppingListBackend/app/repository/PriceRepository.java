package com.agh.shoppingListBackend.app.repository;

import com.agh.shoppingListBackend.app.models.ItemPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PriceRepository extends JpaRepository<ItemPrice, Long> {

}
