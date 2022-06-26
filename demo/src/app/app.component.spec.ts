import { TestBed } from "@angular/core/testing";
import { Piumino } from "piumino";
import { AppComponent } from "./app.component";
import { DummyComponent } from "./dummy.component";

describe("AppComponent", () => {
    const piumino = new Piumino();

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                DummyComponent,
            ],
        }).compileComponents();

        const fixture = TestBed.createComponent(AppComponent);
        piumino.init(fixture);
    });

    // 31 should succeed
    describe("Should succeed", () => {
        it(...piumino.expect("[data-testid=\"text\"]").toHaveText("Should have this text").build());
        it(...piumino.expect("[data-testid=\"text\"]").not.toHaveText("Should not have this text").build());
    
        it(...piumino.expect("[data-testid=\"text\"]").toHaveTextCaseInsensitive("ShOuLd HaVe ThIs TeXt").build());
        it(...piumino.expect("[data-testid=\"text\"]").not.toHaveTextCaseInsensitive("ShOuLd NoT hAvE tHiS tExT").build());
    
        it(...piumino.expect("[data-testid=\"present\"]").toBePresent().build());
        it(...piumino.expect("[data-testid=\"present\"]").not.toBeVisible().build());
    
        it(...piumino.expect("[data-testid=\"visible\"]").toBeVisible().build());
    
        it(...piumino.expect("dummy").input("inputA").toEqual("static text").build());
        it(...piumino.expect("dummy").input("inputA").not.toEqual("not this static text").build());
    
        it(...piumino.expect("dummy").input("inputB").toBeBoundTo("someProperty").build());
        it(...piumino.expect("dummy").input("inputB").not.toBeBoundTo("someOtherProperty").build());
    
        it(...piumino.expect("dummy").input("inputB").toBeBoundTo("someProperty").modifyWith("modified text").build());
        it(...piumino.expect("dummy").input("inputB").not.toBeBoundTo("someOtherProperty").modifyWith("modified text").build());
    
        it(...piumino.expect("dummy").input("inputC").toCall("someFunction").build());
        it(...piumino.expect("dummy").input("inputC").not.toCall("someOtherFunction").build());
    
        it(...piumino.expect("dummy").input("inputD").toCall("someFunction").with("text from property").build());
        it(...piumino.expect("dummy").input("inputD").not.toCall("someFunction").with("not this text from property").build());
        it(...piumino.expect("dummy").input("inputD").not.toCall("someOtherFunction").with("text from property").build());
    
        it(...piumino.expect("dummy").output("outputA").toBeBoundTo("someProperty").build());
        it(...piumino.expect("dummy").output("outputA").not.toBeBoundTo("someOtherProperty").build());
    
        it(...piumino.expect("dummy").output("outputA").toBeBoundTo("someProperty").modifyWith("modified text").build());
        it(...piumino.expect("dummy").output("outputA").not.toBeBoundTo("someOtherProperty").modifyWith("modified text").build());
        it(...piumino.expect("dummy").output("outputB").toBeBoundTo("someProperty").modifyWith("static text").build());
        it(...piumino.expect("dummy").output("outputB").not.toBeBoundTo("someOtherProperty").modifyWith("static text").build());
    
        it(...piumino.expect("dummy").output("outputC").toCall("someFunction").build());
        it(...piumino.expect("dummy").output("outputC").not.toCall("someOtherFunction").build());
    
        it(...piumino.expect("dummy").output("outputD").toCall("someFunction").with("modified text").build());
        it(...piumino.expect("dummy").output("outputD").not.toCall("someOtherFunction").with("modified text").build());
    
        it(...piumino.expect("dummy").output("outputE").toCall("someFunction").with("static text", "modified text").build());
        it(...piumino.expect("dummy").output("outputE").not.toCall("someFunction").with("not this static text", "modified text").build());
        it(...piumino.expect("dummy").output("outputE").not.toCall("someOtherFunction").with("static text", "modified text").build());
    });

    // 29 should fail
    describe("Should fail", () => {
        it(...piumino.expect("[data-testid=\"text\"]").toHaveText("Should not have this text").build());
        it(...piumino.expect("[data-testid=\"text\"]").not.toHaveText("Should have this text").build());
    
        it(...piumino.expect("[data-testid=\"text\"]").toHaveTextCaseInsensitive("ShOuLd NoT hAvE tHiS tExT").build());
        it(...piumino.expect("[data-testid=\"text\"]").not.toHaveTextCaseInsensitive("ShOuLd HaVe ThIs TeXt").build());
    
        it(...piumino.expect("[data-testid=\"present\"]").toBeVisible().build());
        it(...piumino.expect("[data-testid=\"present\"]").not.toBePresent().build());
    
        it(...piumino.expect("[data-testid=\"visible\"]").not.toBeVisible().build());
    
        it(...piumino.expect("dummy").input("inputA").toEqual("not this static text").build());
        it(...piumino.expect("dummy").input("inputA").not.toEqual("static text").build());
    
        it(...piumino.expect("dummy").input("inputB").toBeBoundTo("someOtherProperty").build());
        it(...piumino.expect("dummy").input("inputB").not.toBeBoundTo("someProperty").build());
    
        it(...piumino.expect("dummy").input("inputB").toBeBoundTo("someOtherProperty").modifyWith("modified text").build());
        it(...piumino.expect("dummy").input("inputB").not.toBeBoundTo("someProperty").modifyWith("modified text").build());
    
        it(...piumino.expect("dummy").input("inputC").toCall("someOtherFunction").build());
        it(...piumino.expect("dummy").input("inputC").not.toCall("someFunction").build());
    
        it(...piumino.expect("dummy").input("inputD").toCall("someOtherFunction").with("text from property").build());
        it(...piumino.expect("dummy").input("inputD").not.toCall("someFunction").with("text from property").build());
    
        it(...piumino.expect("dummy").output("outputA").toBeBoundTo("someOtherProperty").build());
        it(...piumino.expect("dummy").output("outputA").not.toBeBoundTo("someProperty").build());
    
        it(...piumino.expect("dummy").output("outputA").toBeBoundTo("someOtherProperty").modifyWith("modified text").build());
        it(...piumino.expect("dummy").output("outputA").not.toBeBoundTo("someProperty").modifyWith("modified text").build());
        it(...piumino.expect("dummy").output("outputB").toBeBoundTo("someOtherProperty").modifyWith("static text").build());
        it(...piumino.expect("dummy").output("outputB").not.toBeBoundTo("someProperty").modifyWith("static text").build());
    
        it(...piumino.expect("dummy").output("outputC").toCall("someOtherFunction").build());
        it(...piumino.expect("dummy").output("outputC").not.toCall("someFunction").build());
    
        it(...piumino.expect("dummy").output("outputD").toCall("someOtherFunction").with("modified text").build());
        it(...piumino.expect("dummy").output("outputD").not.toCall("someFunction").with("modified text").build());
    
        it(...piumino.expect("dummy").output("outputE").toCall("someOtherFunction").with("static text", "modified text").build());
        it(...piumino.expect("dummy").output("outputE").not.toCall("someFunction").with("static text", "modified text").build());
    });
});
