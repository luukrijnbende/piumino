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

  it(...piumino.expect("[data-testid=\"to-have-text\"]").toHaveText("test").build());


  // it('should create the app', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   expect(app).toBeTruthy();
  // });

  // it(`should have as title 'angular-starter'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   expect(app.title).toEqual('angular-starter');
  // });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('angular-starter app is running!');
  // });
});