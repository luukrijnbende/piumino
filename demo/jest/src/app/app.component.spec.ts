import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Piumino } from "piumino";

describe('AppComponent', () => {
  const piumino = new Piumino();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    piumino.init(fixture);
  });

  it(...piumino.expect("[data-testid=\"to-have-text\"]").toHaveText("Should have this text").build());
  it(...piumino.expect("[data-testid=\"to-have-text\"]").toHaveText("Should fail").build());
});
