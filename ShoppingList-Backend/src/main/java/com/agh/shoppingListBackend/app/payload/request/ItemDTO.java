package com.agh.shoppingListBackend.app.payload.request;

import com.agh.shoppingListBackend.app.enums.Units;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class ItemDTO {
    @NotBlank
    private String text;

    @NotNull
    private Float quantity;

    @NotNull
    private Units unit;

    @NotNull
    private Long listId;

    public String getText(){ return text;}

    public void setText(String text) {this.text = text;}

    public Float getQuantity(){ return quantity;}

    public void setQuantity(Float quantity) {this.quantity = quantity;}

    public Units getUnit(){ return unit;}

    public void setUnit(Units unit) {this.unit = unit;}

    public Long getListId() {return listId;}

    public void setList(Long listId) {this.listId = listId;}
}
