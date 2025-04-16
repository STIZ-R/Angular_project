import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../storage.service';
import { Note } from '../note.model';
import { Tag } from '../tag';
import { NoteComponent } from '../note/note.component';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, NoteComponent],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})

export class NotesComponent implements OnInit {
  //main données
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  tags: Tag[] = [];
  searchQuery = '';
  isSorted = false;

  //pour les notes
  newNoteTitle = '';
  newNoteColor = '#FFFFFF';
  newNoteContent = '';
  selectedTagIds: number[] = [];

  //pour les tags
  newTagName = '';
  newTagColor = '#FFFFFF';
  tagError = '';

  //pour modifier la note
  editingNote: Note | null = null;
  editingTagIds: number[] = [];




  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadNotes();
    this.loadTags();
    this.filteredNotes = [...this.notes];
  }

  loadNotes(): void {
    this.notes = this.storageService.getNotes();
    this.filterNotes();
  }

  loadTags(): void {
    this.tags = this.storageService.getTags();
  }


  filterNotes(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredNotes = [...this.notes];
    } else {
      this.filteredNotes = this.notes.filter(note => {
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesContent = note.content.toLowerCase().includes(query);
        const matchesTags = note.tagIds.some(tagId => {
          const tag = this.tags.find(t => t.id === tagId);
          return tag && tag.name.toLowerCase().includes(query);
        });
        return matchesTitle || matchesContent || matchesTags;
      });
    }
    if (this.isSorted) {
      this.sortNotes();
    }
  }


  sortNotes(): void {
    this.isSorted = !this.isSorted;
    if (this.isSorted) {
      this.filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      this.filteredNotes = [...this.notes];
      this.filterNotes();
    }
  }

  createNote(): void {
    if (!this.editingNote) {
      const note = this.storageService.createNote(this.newNoteTitle, this.newNoteColor, this.newNoteContent);
      if (note) {
        this.selectedTagIds.forEach(tagId => {
          this.storageService.addTagToNote(note.id, tagId);
        });
        this.resetForm();
      }
    }
  }

  editNote(id: number): void {
    const note = this.notes.find(n => n.id === id);
    if (note) {
      this.editingNote = note;
      this.newNoteTitle = note.title;
      this.newNoteColor = note.backgroundColor;
      this.newNoteContent = note.content;
      this.editingTagIds = [...note.tagIds];
      this.selectedTagIds = [...note.tagIds];
      this.tagError = '';
    }
  }

  updateNote(): void {
    if (this.editingNote && this.newNoteTitle.trim()) {
      this.storageService.updateNote(
        this.editingNote.id,
        this.newNoteTitle,
        this.newNoteColor,
        this.newNoteContent
      );
      const currentTagIds = this.editingNote.tagIds;
      currentTagIds.forEach(tagId => {
        if (!this.selectedTagIds.includes(tagId)) {
          this.storageService.removeTagFromNote(this.editingNote!.id, tagId);
        }
      });
      this.selectedTagIds.forEach(tagId => {
        if (!currentTagIds.includes(tagId)) {
          this.storageService.addTagToNote(this.editingNote!.id, tagId);
        }
      });
      this.resetForm();
    } else {
      this.tagError = 'Le titre ne peut pas être vide.';
    }
  }

  cancelEdit(): void {
    this.resetForm();
  }

  createTag(): void {
    if (this.newTagName.trim()) {
      const tag = this.storageService.createTag(this.newTagName, this.newTagColor);
      if (tag) {
        this.selectedTagIds.push(tag.id);
        this.newTagName = '';
        this.newTagColor = '#000000';
        this.tagError = '';
        this.loadTags();
      } else {
        this.tagError = 'Ce tag existe déjà ou le nom est invalide.';
      }
    } else {
      this.tagError = 'Le nom du tag ne peut pas être vide.';
    }
  }

  deleteNote(id: number): void {
    if (this.storageService.deleteNote(id)) {
      this.loadNotes();
      if (this.editingNote?.id === id) {
        this.resetForm();
      }
    }
  }

  private resetForm(): void {
    this.loadNotes();
    this.newNoteTitle = '';
    this.newNoteColor = '#FFFFFF';
    this.newNoteContent = '';
    this.selectedTagIds = [];
    this.newTagName = '';
    this.newTagColor = '#000000';
    this.tagError = '';
    this.editingNote = null;
    this.editingTagIds = [];
  }
}
