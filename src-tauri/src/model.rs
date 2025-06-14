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

#[derive(Serialize, Deserialize)]
pub struct PlayerRecord {
    pub id: usize,
    pub player: Player,
}

#[derive(Deserialize)]
pub struct PlayerFilters {
    pub country: Option<i32>,
    pub club: Option<i32>,
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
