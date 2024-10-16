import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourBoardComponent } from './your-board.component';

describe('YourBoardComponent', () => {
  let component: YourBoardComponent;
  let fixture: ComponentFixture<YourBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
