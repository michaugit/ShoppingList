package com.agh.shoppingListBackend.app.repository;

import com.agh.shoppingListBackend.app.models.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListRepository extends JpaRepository<List, Long> {

}
