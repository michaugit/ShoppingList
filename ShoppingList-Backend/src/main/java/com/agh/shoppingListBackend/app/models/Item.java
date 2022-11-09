package com.agh.shoppingListBackend.app.models;

import com.agh.shoppingListBackend.app.enums.Units;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    @NotNull
    private Float quantity;

    @Enumerated(EnumType.STRING)
    private Units unit;

    @Lob
    private byte[] image;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="list_id", nullable = false)
    private ShoppingList list;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable = false)
    private User user;

}

