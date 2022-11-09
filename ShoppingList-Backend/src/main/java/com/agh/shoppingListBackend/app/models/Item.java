package com.agh.shoppingListBackend.app.models;

import com.agh.shoppingListBackend.app.enums.Units;

import javax.persistence.*;
import javax.validation.constraints.NotNull;


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

    public Long getId(){ return id; }

    public void setId(Long id){ this.id = id;}

    public String getText(){ return text;}

    public void setText(String text) {this.text = text;}

    public Float getQuantity(){ return quantity;}

    public void setQuantity(Float quantity) {this.quantity = quantity;}

    public Units getUnit(){ return unit;}

    public void setUnit(Units unit) {this.unit = unit;}

    public byte[] getImage(){return this.image;}

    public void setImage(byte[] image){this.image = image;}

    public ShoppingList getList() {return list;}

    public void setList(ShoppingList list) {this.list = list;}

    public User getUser(){return user;}

    public void setUser(User user) {this.user = user;}
}

