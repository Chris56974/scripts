import {
  grabFilesAndDirectories,
  putFilesInTheirOwnDir,
  undo,
  filterOutTheNewlyCreatedDirsFromThePreviousDirs
} from './index'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import path from 'path'
import { beforeAll, afterAll, describe, expect, it } from "bun:test"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TEST_FOLDER_PATH = path.join(__dirname, '/helper')

beforeAll(async () => {
  await fs.mkdir(path.join(TEST_FOLDER_PATH, 'foo'), { recursive: true })
  await fs.writeFile(path.join(TEST_FOLDER_PATH, 'foo', 'bar.js'), '')
  await fs.writeFile(path.join(TEST_FOLDER_PATH, 'baz.txt'), '')
})

afterAll(async () => {
  await fs.rm(TEST_FOLDER_PATH, { recursive: true, force: true })
})

describe('grabFilesAndDirectories', () => {
  it('returns the top level files and directories for a given path', async () => {
    const dirEntries = await fs.readdir(TEST_FOLDER_PATH, {
      withFileTypes: true,
    })

    const [files, dirs] = grabFilesAndDirectories(dirEntries)
    expect(files.length).toBe(1)
    expect(dirs.length).toBe(1)
  })
})

beforeAll(async () => {
  // Create a folder with three files
  await fs.mkdir(path.join(TEST_FOLDER_PATH, 'foo'), { recursive: true })
  await fs.writeFile(path.join(TEST_FOLDER_PATH, 'bar.txt'), '')
  await fs.writeFile(path.join(TEST_FOLDER_PATH, 'baz.txt'), '')
})

afterAll(async () => {
  await fs.rm(TEST_FOLDER_PATH, { recursive: true, force: true })
})

describe('putFilesInTheirOwnDir', () => {
  it('should nest all files in their own directories and undo the same process', async () => {
    const prevDirEntries = await fs.readdir(TEST_FOLDER_PATH, {
      withFileTypes: true,
    })

    const [prevFiles, prevDirs] = grabFilesAndDirectories(prevDirEntries)

    expect(prevFiles.length).toEqual(2)
    expect(prevDirs.length).toEqual(1)

    await putFilesInTheirOwnDir(TEST_FOLDER_PATH)

    const newEntries = await fs.readdir(TEST_FOLDER_PATH, {
      withFileTypes: true,
    })

    const [newFiles, newDirs] = grabFilesAndDirectories(newEntries)

    expect(newFiles.length).toEqual(0)
    expect(newDirs.length).toEqual(3)

    const newFilteredDirs = filterOutTheNewlyCreatedDirsFromThePreviousDirs(
      newDirs,
      prevDirs
    )

    expect(newFilteredDirs.length).toEqual(2)

    const eachDirOnlyContainsOneFile = newFilteredDirs.every(async (dir) => {
      const dirPath = path.join(TEST_FOLDER_PATH, dir)
      const dirEntries = await fs.readdir(dirPath, { withFileTypes: true })

      return dirEntries.length === 1 && dirEntries[0].isFile()
    })

    const fileSharesTheSameName = newFilteredDirs.every(async (dir) => {
      const dirPath = path.join(TEST_FOLDER_PATH, dir)
      const dirEntries = await fs.readdir(dirPath, { withFileTypes: true })

      return dirEntries[0].name === dir
    })

    expect(eachDirOnlyContainsOneFile).toBe(true)
    expect(fileSharesTheSameName).toBe(true)

    await undo(TEST_FOLDER_PATH, newFilteredDirs)

    const dirEntriesAfterUndo = await fs.readdir(TEST_FOLDER_PATH, {
      withFileTypes: true,
    })

    const [filesAfterUndo, dirsAfterUndo] =
      grabFilesAndDirectories(dirEntriesAfterUndo)

    expect(filesAfterUndo.length).toEqual(2)
    expect(dirsAfterUndo.length).toEqual(1)
  })
})