#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const dtsPath = path.join(__dirname, '../dist/index.d.ts');
const content = fs.readFileSync(dtsPath, 'utf8');
fs.writeFileSync(dtsPath, `/// <reference lib="es2015.iterable" />\n${content}`);
