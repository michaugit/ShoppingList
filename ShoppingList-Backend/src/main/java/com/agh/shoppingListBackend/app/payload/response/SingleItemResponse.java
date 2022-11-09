package com.agh.shoppingListBackend.app.payload.response;

import com.agh.shoppingListBackend.app.enums.Units;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class SingleItemResponse {
    private Long id;
    private String text;
    private Float quantity;
    private Units unit;


    public SingleItemResponse(Long id, String text, Float quantity, Units unit){
        this.id = id;
        this.text = text;
        this.quantity = quantity;
        this.unit = unit;
    }
}
