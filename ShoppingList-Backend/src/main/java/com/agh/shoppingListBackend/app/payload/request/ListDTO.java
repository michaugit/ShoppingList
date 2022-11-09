package com.agh.shoppingListBackend.app.payload.request;

import com.agh.shoppingListBackend.app.models.Item;
import com.agh.shoppingListBackend.app.models.User;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.sql.Date;
import java.util.Set;

public class ListDTO {
    @NotBlank
    private String name;

    @NotBlank
    private String date;

    public String getName(){ return name;}

    public void setName(String name) {this.name = name;}

    public String getDate(){ return date;}

    public void setDate(String date) {this.date = date;}

}
