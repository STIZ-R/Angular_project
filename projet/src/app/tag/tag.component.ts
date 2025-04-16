import { Component, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent {
  id = input.required<number>();
  name = input.required<string>();
  color = input.required<string>();

  @Output() click = new EventEmitter<number>();
  @Output() doubleClick = new EventEmitter<number>();

  onClick(): void {
    this.click.emit(this.id());
  }

  onDoubleClick(): void {
    this.doubleClick.emit(this.id());
  }
}
