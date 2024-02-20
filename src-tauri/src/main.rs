// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::Serialize;
use sysinfo::Disks;
use tauri::Manager;
use tauri::WindowEvent;
use window_shadows::set_shadow;
use window_vibrancy::apply_acrylic;

fn main() {
    let mut builder = tauri::Builder::default();
    builder = builder.setup(|app| {
        let window = app.get_window("main").unwrap();

        #[cfg(target_os = "windows")]
        apply_acrylic(&window, Some((0, 0, 0, 125))).expect("Failed to apply acrylic");
        set_shadow(&window, true).unwrap();

        Ok(())
    });

    builder
        .on_window_event(|e| {
            if let WindowEvent::Resized(_) = e.event() {
                std::thread::sleep(std::time::Duration::from_nanos(1));
            }
        })
        .invoke_handler(tauri::generate_handler![
            get_files,
            get_disks,
            apply_window_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Serialize, serde::Deserialize)]
enum ItemType {
    File,
    Directory,
}

#[derive(Serialize, serde::Deserialize)]
struct Item {
    name: String,
    _type: ItemType,
    extension: String,
}

#[tauri::command]
fn get_files(path: &str) -> Result<Vec<Item>, tauri::InvokeError> {
    let path = std::path::Path::new(path);

    if !path.exists() {
        return Err(tauri::InvokeError::from(format!(
            "Path does not exist: {}",
            path.display()
        )));
    }

    let mut files = Vec::new();
    for entry in std::fs::read_dir(path).map_err(|e| tauri::InvokeError::from(e.to_string()))? {
        let entry = match entry {
            Ok(entry) => entry,
            Err(e) => return Err(tauri::InvokeError::from(e.to_string())),
        };
        let path = entry.path();

        let extension = path
            .extension()
            .and_then(|ext| ext.to_str())
            .unwrap_or("")
            .to_string();

        let name = path
            .file_name()
            .and_then(|name| name.to_str())
            .unwrap_or("")
            .to_string();

        let file = Item {
            name,
            extension,
            _type: if path.is_dir() {
                ItemType::Directory
            } else {
                ItemType::File
            },
        };
        files.push(file);
    }
    Ok(files)
}

#[derive(Serialize)]
struct Disk {
    name: String,
    mount_point: String,
    size: u64,
    free: u64,
    kind: String,
}

#[tauri::command]
fn get_disks() -> Result<Vec<Disk>, tauri::InvokeError> {
    let disks = Disks::new_with_refreshed_list();
    let mut disk_list = Vec::new();
    for disk in disks.list() {
        let disk = Disk {
            name: disk.name().to_string_lossy().to_string(),
            mount_point: disk.mount_point().to_string_lossy().to_string(),
            size: disk.total_space(),
            free: disk.available_space(),
            kind: disk.kind().to_string(),
        };
        disk_list.push(disk);
    }
    Ok(disk_list)
}

#[tauri::command]
fn apply_window_settings(
    label: String,
    app_handle: tauri::AppHandle,
) -> Result<(), tauri::InvokeError> {
    #[cfg(target_os = "windows")]
    let window = app_handle.get_window(&label).unwrap();
    apply_acrylic(&window, Some((0, 0, 0, 125))).expect("Failed to apply acrylic");
    set_shadow(&window, true).unwrap();
    Ok(())
}
