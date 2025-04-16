//import de base
import { Component, input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../note.model';
import { StorageService } from '../storage.service';
import { TagComponent } from '../tag/tag.component';


//liaison avec les fichiers
@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule, TagComponent],
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})

export class NoteComponent {
  //on indique les signaux d'entrées obligatoires (note et tags)
  note = input.required<Note>();
  tags = input.required<{ id: number; name: string; color: string }[]>();

  //on gère les evenements clique simple et dbl clique (ça prend l'id de la note)
  @Output() click = new EventEmitter<number>();
  @Output() doubleClick = new EventEmitter<number>();

  //on utilise le storageservice pour le localstorage
  constructor(private storageService: StorageService) {}

  //on déclenche quand on clique 2 ou simple en envoyant l'id
  onClick(): void {
    this.click.emit(this.note().id);
  }

  onDoubleClick(): void {
    this.doubleClick.emit(this.note().id);
  }

  //dans le tab de tags, on cherche un tag avec l'id et retourne soit un tag (s'il le trouve) soit rien
  getTagById(tagId: number): { id: number; name: string; color: string } | undefined {
    return this.tags().find(tag => tag.id === tagId);
  }
}
