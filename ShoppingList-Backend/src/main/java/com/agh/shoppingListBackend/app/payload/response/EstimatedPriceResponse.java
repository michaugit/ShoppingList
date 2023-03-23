package com.agh.shoppingListBackend.app.payload.response;

import com.agh.shoppingListBackend.app.enums.Units;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class EstimatedPriceResponse{
    private Float price;
    private Units unit;
}
