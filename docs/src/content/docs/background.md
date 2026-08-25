---
title: What keeps running
description: The services oss can leave running on your machine, how to see them, and how to stop them.
---

Nothing runs in the background unless you install it. Three things can, each
asked for explicitly, and each stoppable with the command that installed it.

| What | Where | Installed by |
|---|---|---|
| The local page | `localhost:1504` | `oss serve --install` |
| The daily harvest | no port, daily | `oss memory schedule --install` |

There used to be a third: a pack could serve a page of its own, on its own port.
The read-only half of it is in `oss` now and the half that could post upstream
stayed with the pack that owned it, so nothing installs it and nothing serves
it. The port it used is not written here on purpose -- a number a reader can
still find is a number somebody tries.

They use the platform's own service manager — **launchd** on macOS, **systemd
--user** on Linux, **Task Scheduler** on Windows. Not a background thread, not a
wrapper script, not a cron entry: none of those restart after a crash or survive
a reboot, and none can be inspected with the tools you already have.

## The local page

```bash
oss serve                 # foreground — stops when you close the terminal
oss serve --install       # starts at login, restarts if it dies
oss serve --uninstall     # stop starting it at login
oss serve --port 9000     # somewhere else
```

**`oss serve` on its own is foreground.** It runs while that terminal is open and
stops when it closes. If `localhost:1504` is dead after you were using it, that
is almost always the reason — `--install` is what makes it outlive the terminal.

The first time you run it at a terminal it says so and offers, once:

```
  This stops when you close this terminal.
  Keep it running — start at login, restart if it dies? [y/N] y
  handing this port to the background service…
  ✓ starts at login — launchd agent installed: …/com.osscli.serve.plist
  ✓ http://localhost:1504/ is answering — you can close this terminal
```

Answering yes **hands the port over and gives you the terminal back**: the
foreground server stops, the service takes 1504, and nothing is claimed until
something is actually answering there. Answering no is remembered, so the
question is asked once rather than once per start — `oss serve --install` is
still there if you change your mind. Neither answer is offered when there is no
terminal to answer at.

## Seeing what is running

```bash
# macOS
launchctl list | grep -E 'osscli|oss-harvest'

# Linux
systemctl --user status oss-serve

# any platform — is it actually answering?
curl -sI localhost:1504 | head -1
```

The second column of `launchctl list` is the **last exit status**. A number other
than `0` there means it ran and failed, which is worth more than the fact that it
is installed.

Logs go to `~/.oss-cli/logs/serve.{out,err}.log`. A pack writes its own
somewhere it names when it installs.

## The failure worth knowing about

A service records *how to start itself* at install time. If that recorded path
later moves, the service dies at every login, into a log nobody reads — so the
symptom is "the page stopped working" with nothing obvious to connect it to.

This has bitten three times here:

- an agent pointing at a script that moved to another repository
- a script whose idea of its own directory was one level off after a file moved
- **an agent pointing inside a versioned install directory** — `brew upgrade`
  deletes the old one, so the service broke on the very next upgrade

The last one is fixed by recording `oss` as found on your `PATH` rather than the
resolved jar: Homebrew re-points that name on every upgrade, so the same recorded
string keeps meaning the current version.

If a page you installed has stopped answering, re-run its installer — that
rewrites the recorded path:

```bash
oss serve --uninstall && oss serve --install
```

## Stopping all of it

```bash
oss serve --uninstall             # the page
oss memory schedule --uninstall   # the daily harvest
```

Each removes its own definition; nothing is left behind and no data is touched.
Neither reads the other's, so stopping one leaves the other running -- which is
why both are written out here rather than described as "the same way".
