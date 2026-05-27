# Linux + Git + Windows Commands Cheat Sheet
// collected from google
## 1. Basic Linux Files (locations & purpose)

| File/Directory | Purpose |
|----------------|---------|
| `/etc/passwd` | User account info |
| `/etc/shadow` | Encrypted passwords (root only) |
| `/etc/group` | Group definitions |
| `/etc/fstab` | Filesystem mount points |
| `/etc/hosts` | Static hostname ↔ IP mapping |
| `/etc/hostname` | System hostname |
| `/etc/resolv.conf` | DNS servers |
| `/var/log/syslog` | Main system log (Debian/Ubuntu) |
| `/var/log/messages` | Main system log (RHEL/CentOS) |
| `/var/log/auth.log` | Authentication logs |
| `/etc/ssh/sshd_config` | SSH server config |
| `/etc/crontab` | System-wide cron jobs |
| `/home/username/` | User's personal files |
| `/root/` | Home of root user |
| `/boot/` | Kernel & bootloader files |
| `/etc/skel/` | Template for new user homes |
| `/proc/` | Virtual kernel/process info (e.g., `/proc/cpuinfo`) |

---

## 2. Most Useful Linux Commands (with Windows equivalents)

| Linux command | Windows equivalent (CMD / PowerShell) | Description |
|---------------|----------------------------------------|-------------|
| `ls -la` | `dir` (CMD) or `Get-ChildItem -Force` (PS) | List directory contents |
| `cd /var/log` | `cd C:\Windows` | Change directory |
| `pwd` | `cd` (no args) or `Get-Location` (PS) | Show current directory |
| `cp file1 file2` | `copy file1 file2` (CMD) / `Copy-Item` (PS) | Copy file |
| `mv old new` | `move old new` (CMD) / `Move-Item` (PS) | Move / rename |
| `rm file.txt` | `del file.txt` (CMD) / `Remove-Item file.txt` (PS) | Delete file |
| `mkdir dir` | `mkdir dir` (both) | Create directory |
| `touch file.txt` | `type nul > file.txt` (CMD) / `New-Item file.txt` (PS) | Create empty file |
| `cat file.txt` | `type file.txt` (CMD) / `Get-Content file.txt` (PS) | Show file content |
| `less file.txt` | `more file.txt` (CMD) | Scroll through file |
| `head -20 file.txt` | `Get-Content file.txt -TotalCount 20` (PS) | First 20 lines |
| `tail -f file.txt` | `Get-Content file.txt -Wait` (PS) | Follow live output |
| `nano file.txt` | `notepad file.txt` (CMD) | Text editor |
| `chmod 755 script.sh` | `icacls script.sh /grant User:RX` (approx.) | Change permissions |
| `ps aux` | `tasklist` (CMD) / `Get-Process` (PS) | List processes |
| `top` / `htop` | `Get-Process | Sort CPU -Descending` (PS) | Live process monitor |
| `kill -9 PID` | `taskkill /F /PID PID` (CMD) / `Stop-Process -Force -ID PID` (PS) | Force kill process |
| `grep "error" log.txt` | `findstr "error" log.txt` (CMD) / `Select-String` (PS) | Search text |
| `find /home -name "*.pdf"` | `dir /s *.pdf` (CMD) / `Get-ChildItem -Recurse *.pdf` (PS) | Find files by name |
| `df -h` | `wmic logicaldisk get size,freespace,devicid` (CMD) / `Get-PSDrive` (PS) | Disk space usage |
| `du -sh /home` | Use `diruse` or `Get-ChildItem -Recurse | Measure-Object -Sum Length` (PS) | Size of directory |
| `free -h` | `systeminfo | find "Memory"` (CMD) / `Get-CimInstance Win32_OperatingSystem` (PS) | Memory usage |
| `uname -a` | `ver` or `systeminfo` (CMD) / `Get-ComputerInfo` (PS) | System info |
| `uptime` | `systeminfo | find "Boot Time"` (CMD) / `(Get-CimInstance Win32_OperatingSystem).LastBootUpTime` (PS) | Uptime |
| `whoami` | `whoami` (both) | Current username |
| `ip a` / `ifconfig` | `ipconfig` (CMD) / `Get-NetIPAddress` (PS) | Network interfaces & IPs |
| `ping google.com` | `ping google.com` (both) | Test connectivity |
| `curl ifconfig.me` | `curl ifconfig.me` (PowerShell 6+) / `Invoke-WebRequest` | Get public IP |
| `netstat -tulpn` | `netstat -an` (CMD) | Listening ports |
| `ssh user@server` | `ssh user@server` (Windows 10+ built-in) | SSH into remote |
| `scp file user@host:/path/` | `scp` (same, Windows 10+ / WinSCP) | Copy file over SSH |
| `tar -czf archive.tar.gz folder/` | `tar -czf archive.tar.gz folder` (Windows 10+ supports tar) | Create .tar.gz |
| `tar -xzf archive.tar.gz` | `tar -xzf archive.tar.gz` | Extract .tar.gz |
| `zip -r archive.zip folder/` | `Compress-Archive -Path folder -DestinationPath archive.zip` (PS) | Create .zip |
| `unzip archive.zip` | `Expand-Archive -Path archive.zip -DestinationPath .` (PS) | Extract .zip |
| `sudo apt update` | Run CMD/PowerShell as Administrator | Package manager (none native, use Winget/Chocolatey) |
| `command > file` | `command > file` (both) | Redirect output (overwrite) |
| `command >> file` | `command >> file` (both) | Append output |
| `command 2> error.log` | `command 2> error.log` (CMD) / `command 2> error.log` (PS) | Redirect errors |
| `ps aux \| grep ssh` | `tasklist \| findstr ssh` (CMD) / `Get-Process \| Where-Object {$_.ProcessName -match "ssh"}` (PS) | Pipe and filter |
| `man ls` | `help dir` (CMD) / `Get-Help Get-ChildItem` (PS) | Manual / help |

---

## 3. Git Login, Upload, Update Commands

### Configure Git (first time / login)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Optional: set default branch name
git config --global init.defaultBranch main

Basic Workflow (upload / update)
bash

# Clone an existing repository
git clone https://github.com/username/repo.git
cd repo

# Check status & changes
git status
git diff

# Add files to staging area
git add filename   # single file
git add .       # all new/modified files

# Commit changes locally
git commit -m "Your commit message"

# Push (upload) to remote repository
git push origin main  # main = branch name

# Pull (update) latest changes from remote
git pull origin main

# If you have not yet set upstream branch:
git push -u origin main  # sets upstream for future pushes

Other useful Git commands
bash

git log --oneline        # View commit history
git branch           # List local branches
git checkout -b new-branch   # Create and switch to new branch
git merge branch-name      # Merge another branch into current
git remote -v          # Show configured remotes

4. Pro Tips (Linux)

  Ctrl + C – stop a running command

  Ctrl + Z – suspend, then bg to run in background, fg to bring back

  history – shows last used commands

  Tab completion – type part of command/file and press Tab twice for suggestions

  Always double-check rm commands (no trash can by default)
```
