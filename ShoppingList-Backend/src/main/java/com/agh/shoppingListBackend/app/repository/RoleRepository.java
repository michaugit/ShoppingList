package com.agh.shoppingListBackend.app.repository;

import java.util.Optional;

import com.agh.shoppingListBackend.app.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.agh.shoppingListBackend.app.enums.RoleEnum;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByName(RoleEnum name);
}
