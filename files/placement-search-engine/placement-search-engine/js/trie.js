// trie.js - TRIE (prefix tree)
// Each node = one letter. A path from the root spells a skill.
// Used for: skill search + autocomplete ("py" -> "python")

class TrieNode {
  constructor() {
    this.children = {};   // letter -> TrieNode
    this.isEnd = false;   // true if a complete skill ends at this node
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // Add a skill one letter at a time. Time: O(L), L = length of the skill
  insert(skill) {
    skill = skill.toLowerCase();
    let node = this.root;
    for (const ch of skill) {
      if (!node.children[ch]) {
        node.children[ch] = new TrieNode();
      }
      node = node.children[ch];
    }
    node.isEnd = true;
  }

  // Is this exact skill stored? Time: O(L)
  search(skill) {
    const node = this.findNode(skill.toLowerCase());
    return node !== null && node.isEnd;
  }

  // Autocomplete: every skill that starts with the prefix.
  // Time: O(L + number of letters below the prefix)
  autocomplete(prefix) {
    prefix = prefix.toLowerCase();
    const node = this.findNode(prefix);
    if (node === null) return [];          // no skill starts with this prefix
    const results = [];
    this.collect(node, prefix, results);
    return results.sort();
  }

  // Walk down the tree following the letters of `text`
  findNode(text) {
    let node = this.root;
    for (const ch of text) {
      if (!node.children[ch]) return null;
      node = node.children[ch];
    }
    return node;
  }

  // Depth-first walk: collect every complete skill below this node
  collect(node, current, results) {
    if (node.isEnd) results.push(current);
    for (const ch in node.children) {
      this.collect(node.children[ch], current + ch, results);
    }
  }
}
