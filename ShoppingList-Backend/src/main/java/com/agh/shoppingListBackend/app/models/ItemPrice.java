package com.agh.shoppingListBackend.app.models;

import com.agh.shoppingListBackend.app.enums.Units;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@Entity
@Table(name = "item_prices")
public class ItemPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String itemName;

    @NotNull
    private Float price;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Units unit;
}