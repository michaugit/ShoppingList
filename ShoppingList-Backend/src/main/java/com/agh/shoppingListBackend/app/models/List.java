package com.agh.shoppingListBackend.app.models;


import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.sql.Date;
import java.util.Set;

@Entity
@Table(name = "lists")
public class List {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotNull
    private Date date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "list")
    private Set<Item> items;


    public List(){}

    public List(String name, Date date, User user){
        this.name = name;
        this.date = date;
        this.user = user;
    }

    public Long getId(){ return id; }

    public void setId(Long id){ this.id = id;}

    public String getName(){ return name;}

    public void setName(String name) {this.name = name;}

    public Date getDate(){ return date;}

    public void setDate(Date date) {this.date = date;}

    public User getUser(){return user;}

    public void setUser(User user) {this.user = user;}

    public Set<Item> getItems() {return items;}

    public void setItems(Set<Item> items) {this.items = items;}
}
