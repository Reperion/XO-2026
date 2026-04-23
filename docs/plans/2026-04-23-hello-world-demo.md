# Hello World Function Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Add a `hello_world` function that returns "Hello, World!" with a passing test.

**Architecture:** Create a new Python module with the function, add a test file, follow TDD cycle.

**Tech Stack:** Python 3, pytest

---

### Task 1: Create test file with failing test

**Objective:** Write a failing test for the `hello_world` function.

**Files:**
- Create: `tests/test_hello.py`
- Test: `tests/test_hello.py`

**Step 1: Write failing test**

```python
def test_hello_world():
    from hello import hello_world
    assert hello_world() == "Hello, World!"
```

**Step 2: Run test to verify failure**

Run: `pytest tests/test_hello.py::test_hello_world -v`
Expected: FAIL — "No module named 'hello'"

**Step 3: Commit**

```bash
git add tests/test_hello.py
git commit -m "test: add failing hello world test"
```

---

### Task 2: Create hello.py with hello_world function

**Objective:** Implement the minimal `hello_world` function to pass the test.

**Files:**
- Create: `hello.py`

**Step 1: Write minimal implementation**

```python
def hello_world():
    return "Hello, World!"
```

**Step 2: Run test to verify pass**

Run: `pytest tests/test_hello.py::test_hello_world -v`
Expected: PASS

**Step 3: Commit**

```bash
git add hello.py
git commit -m "feat: add hello_world function"
```
