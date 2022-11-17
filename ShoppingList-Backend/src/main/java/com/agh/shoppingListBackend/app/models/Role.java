package com.agh.shoppingListBackend.app.models;

import com.agh.shoppingListBackend.app.enums.RoleEnum;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "roles")
public class Role {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Enumerated(EnumType.STRING)
  @Column(length = 20)
  private RoleEnum name;

  public Role() { }

  public Role(RoleEnum name) {
    this.name = name;
  }
}