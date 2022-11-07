package com.agh.shoppingListBackend.app.models;

import com.agh.shoppingListBackend.app.enums.Units;

import javax.persistence.*;


@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    @Enumerated(EnumType.STRING)
    private Units unit;

    @Lob
    private byte[] image;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="list_id", nullable = false)
    private List list;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    public Long getId(){ return id; }

    public void setId(Long id){ this.id = id;}

    public String getText(){ return text;}

    public void setText(String text) {this.text = text;}

    public Units getUnit(){ return unit;}

    public void setUnit(Units unit) {this.unit = unit;}

    public List getList() {return list;}

    public void setList(List list) {this.list = list;}

    public User getUser(){return user;}

    public void setUser(User user) {this.user = user;}
}

