use serde::{Deserialize, Serialize};
use std::fmt;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RecordType {
    DetailedFutureRegen,
    SupportStaff,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Player {
    pub record_type: RecordType,
    pub first_name: String,
    pub common_name: Option<String>,
    pub last_name: String,
    pub birth_date: String,
    pub nationality_id: i32,
    pub favourite_team_id: Option<i32>,
    pub ethnicity: i8,
    pub skin_tone: i8,
    pub hair_color: i8,
    pub height: i32,
    pub weight: i32,
    pub preferred_foot: Option<i8>,
    pub position: Option<String>,
    pub favourite_number: Option<i32>,
    pub birth_city: Option<String>,
    pub ca: Option<i32>,
    pub pa: Option<i32>,
    pub club_id: Option<i32>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct PlayerRecord {
    pub id: usize,
    pub player: Player,
}

#[derive(Deserialize)]
pub struct PlayerFilters {
    pub country: Option<i32>,
    pub club: Option<i32>,
    pub min_ca: Option<i32>,
    pub max_ca: Option<i32>,
    pub min_pa: Option<i32>,
    pub max_pa: Option<i32>,
    pub preferred_foot: Option<i8>,
    pub favourite_number: Option<i32>,
    pub birth_year_min: Option<i32>,
    pub birth_year_max: Option<i32>,
    pub sort_by: Option<Vec<String>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PlayerStatistics {
    pub count: usize,
    pub ca_stats: Option<NumberStats>,
    pub pa_stats: Option<NumberStats>,
    pub height_stats: Option<NumberStats>,
    pub weight_stats: Option<NumberStats>,
    pub position_counts: std::collections::HashMap<String, usize>,
    pub preferred_foot_counts: std::collections::HashMap<i8, usize>,
    pub nationality_counts: std::collections::HashMap<i32, usize>,
    pub ethnicity_counts: std::collections::HashMap<i8, usize>,
    pub skin_tone_counts: std::collections::HashMap<i8, usize>,
    pub hair_color_counts: std::collections::HashMap<i8, usize>,
    pub birth_year_counts: std::collections::HashMap<i32, usize>,
    pub birth_month_counts: std::collections::HashMap<u32, usize>,
    pub club_counts: std::collections::HashMap<i32, usize>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct NumberStats {
    pub min: f64,
    pub max: f64,
    pub mean: f64,
    pub median: f64,
    pub q25: f64,
    pub q75: f64,
    pub std_dev: f64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TopPlayers {
    pub top_ca: Vec<PlayerRecord>,
    pub top_pa: Vec<PlayerRecord>,
    pub top_height: Vec<PlayerRecord>,
    pub top_weight: Vec<PlayerRecord>,
    pub top_shortest: Vec<PlayerRecord>,
    pub top_lightest: Vec<PlayerRecord>,
}

impl fmt::Display for RecordType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let value = match self {
            RecordType::DetailedFutureRegen => "DETAILED_FUTURE_REGEN",
            RecordType::SupportStaff => "SUPPORT_STAFF",
        };
        write!(f, "{}", value)
    }
}