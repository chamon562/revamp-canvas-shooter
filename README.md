# revamp-canvas-shooter

My new revamp of my first canvas shooter project.

## Remove a single file from git

- if ever an issue where a file isnt being ignored in the .gitignore in my case i initialized git first and adding and commiting files before adding .gitignore file.
- so found on stackoverflow that i should use this command to remove the cached of that file
- git rm -r --cached server/node_modules
  git commit -m "removing node_modules"
