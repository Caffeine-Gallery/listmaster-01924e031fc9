import Bool "mo:base/Bool";
import Func "mo:base/Func";
import Hash "mo:base/Hash";
import List "mo:base/List";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";

actor ShoppingList {
  // Define the structure for a shopping list item
  public type Item = {
    id: Nat;
    text: Text;
    completed: Bool;
    note: Text;
  };

  // Stable variable to store the items
  private stable var itemEntries : [(Nat, Item)] = [];

  // Create a HashMap to store the items
  private var items = HashMap.HashMap<Nat, Item>(0, Nat.equal, Nat.hash);

  // Counter for generating unique IDs
  private stable var nextId : Nat = 0;

  // Initialize the HashMap with stable data
  private func loadItems() {
    for ((id, item) in itemEntries.vals()) {
      items.put(id, item);
    };
  };

  // Function to add a new item
  public func addItem(text : Text) : async Nat {
    let id = nextId;
    nextId += 1;
    let newItem : Item = {
      id = id;
      text = text;
      completed = false;
      note = "";
    };
    items.put(id, newItem);
    id
  };

  // Function to get all items
  public query func getItems() : async [Item] {
    Iter.toArray(items.vals())
  };

  // Function to update an item's completion status
  public func updateItem(id : Nat, completed : Bool) : async Bool {
    switch (items.get(id)) {
      case (null) { false };
      case (?item) {
        let updatedItem : Item = {
          id = item.id;
          text = item.text;
          completed = completed;
          note = item.note;
        };
        items.put(id, updatedItem);
        true
      };
    }
  };

  // Function to delete an item
  public func deleteItem(id : Nat) : async Bool {
    switch (items.remove(id)) {
      case (null) { false };
      case (?_) { true };
    }
  };

  // New function to add a note to an item
  public func addNoteToItem(id : Nat, note : Text) : async Bool {
    switch (items.get(id)) {
      case (null) { false };
      case (?item) {
        let updatedItem : Item = {
          id = item.id;
          text = item.text;
          completed = item.completed;
          note = note;
        };
        items.put(id, updatedItem);
        true
      };
    }
  };

  // System functions for upgrades
  system func preupgrade() {
    itemEntries := Iter.toArray(items.entries());
  };

  system func postupgrade() {
    loadItems();
  };
}
