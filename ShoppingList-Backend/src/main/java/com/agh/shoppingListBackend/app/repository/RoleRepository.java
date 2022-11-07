package com.agh.shoppingListBackend.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.agh.shoppingListBackend.app.enums.RoleEnum;

@Repository
public interface RoleRepository extends JpaRepository<com.agh.shoppingListBackend.app.models.Role, Long> {
  Optional<com.agh.shoppingListBackend.app.models.Role> findByName(RoleEnum name);
}
