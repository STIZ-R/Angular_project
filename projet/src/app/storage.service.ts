import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Tag } from './tag';
import { Note } from './note.model';

@Injectable({
  providedIn: 'root'
})

export class StorageService {
  private readonly TAGS_KEY = 'tags';
  private readonly NOTES_KEY = 'notes';


  //sans check le moteur de recherche, j'avais des erreurs de localstorage non prit en charge
  //de ce fait, je rends vide le ls si le moteur ne le prend pas en charge
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}




  //TAGS METHODS --------------------------------------------
  public getTags(): Tag[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    return JSON.parse(localStorage.getItem(this.TAGS_KEY) || '[]') as Tag[];
  }

  private saveTags(tags: Tag[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.TAGS_KEY, JSON.stringify(tags));
    }
  }

  createTag(name: string, color = '#FFFFFF'): Tag | null {
    const trimmedName = name?.trim();
    if (!trimmedName) return null;

    const tags = this.getTags();
    if (tags.some(tag => tag.name === trimmedName)) return null;

    const newTag: Tag = {
      id: tags.length ? Math.max(...tags.map(t => t.id)) + 1 : 1,
      name: trimmedName,
      color //de base à FFFFFF
    };

    this.saveTags([...tags, newTag]);
    return newTag;
  }

  deleteTag(id: number): boolean {
    const tags = this.getTags();
    const filteredTags = tags.filter(tag => tag.id !== id);
    if (filteredTags.length === tags.length) return false;

    this.saveTags(filteredTags);
    return true;
  }

  updateTag(id: number, name: string, color: string): boolean {
    const trimmedName = name?.trim();
    if (!trimmedName) return false;

    const tags = this.getTags();
    const tagIndex = tags.findIndex(tag => tag.id === id);
    if (tagIndex === -1 || tags.some(tag => tag.name === trimmedName && tag.id !== id)) return false;

    tags[tagIndex] = { id, name: trimmedName, color };
    this.saveTags(tags);
    return true;
  }
//-------------------------------------------------------------------
//NOTES METHODS -----------------------------------------------------
  public getNotes(): Note[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    return JSON.parse(localStorage.getItem(this.NOTES_KEY) || '[]') as Note[];
  }

  private saveNotes(notes: Note[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.NOTES_KEY, JSON.stringify(notes));
    }
  }

  createNote(title: string, backgroundColor = '#FFFFFF', content = ''): Note | null {
    const trimmedTitle = title?.trim();
    if (!trimmedTitle) return null;

    const notes = this.getNotes();
    const newNote: Note = {
      id: notes.length ? Math.max(...notes.map(n => n.id)) + 1 : 1,
      title: trimmedTitle,
      backgroundColor,
      content,
      tagIds: []
    };

    this.saveNotes([...notes, newNote]);
    return newNote;
  }

  deleteNote(id: number): boolean {
    const notes = this.getNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    if (filteredNotes.length === notes.length) return false;

    this.saveNotes(filteredNotes);
    return true;
  }

  updateNote(id: number, title: string, backgroundColor: string, content: string): boolean {
    const trimmedTitle = title?.trim();
    if (!trimmedTitle) return false;

    const notes = this.getNotes();
    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex === -1) return false;

    notes[noteIndex] = { ...notes[noteIndex], title: trimmedTitle, backgroundColor, content };
    this.saveNotes(notes);
    return true;
  }
  //----------------------------------------------------------------------------------
  //TAGS TO NOTES METHODS ------------------------------------------------------------
  addTagToNote(noteId: number, tagId: number): boolean {
    const notes = this.getNotes();
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex === -1 || notes[noteIndex].tagIds.includes(tagId)) return false;

    notes[noteIndex].tagIds.push(tagId);
    this.saveNotes(notes);
    return true;
  }

  removeTagFromNote(noteId: number, tagId: number): boolean {
    const notes = this.getNotes();
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex === -1) return false;

    notes[noteIndex].tagIds = notes[noteIndex].tagIds.filter(id => id !== tagId);
    this.saveNotes(notes);
    return true;
  }

//----------------------------------------------------------------

}
